// src/components/IndexNow.tsx
import React, { useState, useRef } from 'react';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { motion, AnimatePresence } from "framer-motion";

interface IndexNowProps {
  apiKey: string;
  host: string;
  keyLocation: string;
}

interface UrlValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
}

interface ScheduledSubmission {
  id: string;
  urls: string[];
  schedule: string;
  nextRun: Date;
  isActive: boolean;
}

export const IndexNow: React.FC<IndexNowProps> = ({
  apiKey,
  host,
  keyLocation,
}) => {
  // 状态管理
  const [urls, setUrls] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResults, setValidationResults] = useState<UrlValidationResult[]>([]);
  const [selectedTab, setSelectedTab] = useState('manual');
  const [schedules, setSchedules] = useState<ScheduledSubmission[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 结果状态
  const [result, setResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  // URL验证函数
  const validateUrls = (urlList: string[]): UrlValidationResult[] => {
    return urlList.map(url => {
      const result: UrlValidationResult = { url, isValid: true };
      
      try {
        const urlObj = new URL(url);
        if (!url.startsWith(`https://${host}`)) {
          result.isValid = false;
          result.error = '域名不匹配';
        }
      } catch {
        result.isValid = false;
        result.error = 'URL格式无效';
      }

      return result;
    });
  };

  // 处理URL输入变化
  const handleUrlsChange = (value: string) => {
    setUrls(value);
    const urlList = value.split('\n').filter(url => url.trim());
    setValidationResults(validateUrls(urlList));
  };

  // 处理文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const importedUrls = content.split('\n').filter(url => url.trim());
        setUrls(importedUrls.join('\n'));
        setValidationResults(validateUrls(importedUrls));
      };
      reader.readAsText(file);
    }
  };

  // 创建定时提交
  const createSchedule = (urlList: string[], schedule: string) => {
    const newSchedule: ScheduledSubmission = {
      id: Date.now().toString(),
      urls: urlList,
      schedule,
      nextRun: new Date(Date.now() + parseInt(schedule) * 60000),
      isActive: true,
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  // 提交URLs
  const submitUrls = async (urlList: string[]) => {
    try {
      setIsSubmitting(true);
      setResult({ status: null, message: '' });

      const validUrls = urlList.filter(url => {
        const validation = validateUrls([url])[0];
        return validation.isValid;
      });

      if (validUrls.length === 0) {
        throw new Error('没有有效的URLs可提交');
      }

      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          host,
          key: apiKey,
          keyLocation,
          urlList: validUrls,
        }),
      });

      if (!response.ok) {
        throw new Error(`提交失败: ${response.statusText}`);
      }

      setResult({
        status: 'success',
        message: `成功提交 ${validUrls.length} 个URL`,
      });
    } catch (error) {
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : '提交失败',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">IndexNow URL提交</h2>
        <div className="flex flex-wrap gap-2">
          <Tooltip content="您的IndexNow API密钥">
            <Chip variant="flat" color="primary" className="text-sm">
              API Key: {apiKey}
            </Chip>
          </Tooltip>
          <Tooltip content="您的网站域名">
            <Chip variant="flat" color="secondary" className="text-sm">
              Host: {host}
            </Chip>
          </Tooltip>
        </div>
      </CardHeader>

      <CardBody>
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          {/* 手动提交 */}
          <Tab 
            key="manual" 
            title="手动提交"
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-default-700">
                  输入要提交的URLs（每行一个）
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".txt,.csv"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileImport}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    导入文件
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setUrls('')}
                  >
                    清空
                  </Button>
                </div>
              </div>

              <Textarea
                placeholder={`https://${host}/page1\nhttps://${host}/page2`}
                value={urls}
                onChange={(e) => handleUrlsChange(e.target.value)}
                minRows={5}
                maxRows={10}
                className="font-mono text-sm"
              />

              {/* URL验证预览 */}
              <AnimatePresence>
                {validationResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <Table aria-label="URL validation results">
                      <TableHeader>
                        <TableColumn>URL</TableColumn>
                        <TableColumn>状态</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {validationResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm truncate">
                              {result.url}
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                color={result.isValid ? "success" : "danger"}
                                variant="flat"
                              >
                                {result.isValid ? '有效' : result.error}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                color="primary"
                onPress={() => submitUrls(urls.split('\n').filter(url => url.trim()))}
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? '提交中...' : '提交URLs'}
              </Button>
            </div>
          </Tab>

          {/* 定时提交 */}
          <Tab 
            key="scheduled" 
            title="定时提交"
            className="space-y-6"
          >
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">创建定时任务</h3>
                <div className="space-y-4">
                  <Textarea
                    label="URLs"
                    placeholder={`https://${host}/page1\nhttps://${host}/page2`}
                    minRows={3}
                  />
                  <Select
                    label="提交频率"
                    className="max-w-xs"
                  >
                    <SelectItem key="60">每小时</SelectItem>
                    <SelectItem key="1440">每天</SelectItem>
                    <SelectItem key="10080">每周</SelectItem>
                  </Select>
                  <Button color="primary">
                    创建定时任务
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">现有定时任务</h3>
                <Table aria-label="Scheduled submissions">
                  <TableHeader>
                    <TableColumn>URLs数量</TableColumn>
                    <TableColumn>频率</TableColumn>
                    <TableColumn>下次运行</TableColumn>
                    <TableColumn>状态</TableColumn>
                    <TableColumn>操作</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.urls.length}</TableCell>
                        <TableCell>{schedule.schedule}</TableCell>
                        <TableCell>
                          {schedule.nextRun.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Switch
                            size="sm"
                            isSelected={schedule.isActive}
                            onChange={() => {
                              setSchedules(prev =>
                                prev.map(s =>
                                  s.id === schedule.id
                                    ? { ...s, isActive: !s.isActive }
                                    : s
                                )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => {
                              setSchedules(prev =>
                                prev.filter(s => s.id !== schedule.id)
                              );
                            }}
                          >
                            删除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Tab>
        </Tabs>

        {/* 结果提示 */}
        <AnimatePresence>
          {result.status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg mt-4 ${
                result.status === 'success'
                  ? 'bg-success-50 text-success-600'
                  : 'bg-danger-50 text-danger-600'
              }`}
            >
              {result.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 使用说明 */}
        <div className="mt-6 text-sm text-default-500">
          <h3 className="font-semibold mb-2">提示：</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>每行输入一个URL</li>
            <li>URL必须以https://开头</li>
            <li>所有URL必须属于同一域名</li>
            <li>每次最多可提交10,000个URL</li>
            <li>支持导入.txt或.csv文件</li>
            <li>定时任务将在指定时间自动提交</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};