// src/components/common/WelcomeModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { motion, AnimatePresence } from "framer-motion"; // 添加动画库
import { Tooltip } from "@nextui-org/tooltip";
import { Divider } from "@nextui-org/divider";

type SocialPlatform = 'Email' | 'Discord' ;

interface SocialIconProps {
  platform: SocialPlatform;
  username: string;
}

// 社交媒体图标组件
const SocialIcon: React.FC<SocialIconProps> = ({ platform, username }) => {
  const icons = {
    Email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Discord: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  };

  return (
    <Tooltip content={username}>
      <div className="p-3 bg-default-100 rounded-xl hover:bg-default-200 transition-colors cursor-pointer">
        {icons[platform]}
      </div>
    </Tooltip>
  );
};

// 定义联系方式类型
interface ContactInfo {
  platform: SocialPlatform;
  username: string;
}

interface PaymentMethod {
  name: '支付宝' | '微信支付';
  image: string;
}
export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [neverShow, setNeverShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contact");

  // 定义联系方式数据
  const contactInfo: ContactInfo[] = [
    { platform: 'Email', username: 'lyjcody@foxmail.com' },
    { platform: 'Discord', username: 'DragonJay' },
  ];

  // 定义支付方式数据
  const paymentMethods: PaymentMethod[] = [
    { name: '支付宝', image: 'https://lcap-static-saas.nos-eastchina1.126.net/app/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250123183055_20250123183119321.jpg' },
    { name: '微信支付', image: 'https://lcap-static-saas.nos-eastchina1.126.net/app/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250123183048_20250123183119454.jpg' },
  ];

  useEffect(() => {
    const shouldShow = localStorage.getItem('welcomeModalNeverShow') !== 'true';
    if (shouldShow) {
      setTimeout(() => setIsOpen(true), 1000); // 延迟显示
    }
  }, []);

  const handleClose = () => {
    if (neverShow) {
      localStorage.setItem('welcomeModalNeverShow', 'true');
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          size="2xl"
          scrollBehavior="inside"
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn"
                }
              }
            }
          }}
          className="bg-background/95 backdrop-blur-md dark:bg-default-100/95"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    欢迎访问我们的网站
                  </motion.h2>
                </ModalHeader>
                <ModalBody>
                  <Tabs 
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key.toString())}
                    color="primary"
                    variant="underlined"
                    classNames={{
                      tabList: "gap-6",
                      cursor: "w-full",
                      tab: "max-w-fit px-4 h-12",
                      tabContent: "group-data-[selected=true]:text-primary"
                    }}
                  >
                    <Tab
                      key="contact"
                      title={
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>联系方式</span>
                        </div>
                      }
                    >
                      <Card className="bg-default-50/50 backdrop-blur-sm">
                        <CardBody className="gap-6">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col md:flex-row items-center gap-6"
                          >
                            <div className="w-32 h-32 relative group">
                              <Image
                                src="https://lcap-static-saas.nos-eastchina1.126.net/app/微信图片_20250123204242_20250123204303769.jpg"
                                alt="WeChat QR Code"
                                className="object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-center md:text-left">
                              <h3 className="text-xl font-bold mb-2">QQ</h3>
                              <p className="text-default-500">扫码添加好友</p>
                            </div>
                          </motion.div>

                          <Divider className="my-4" />

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4 justify-center md:justify-start"
                          >
                            {contactInfo.map((contact) => (
                              <SocialIcon
                                key={contact.platform}
                                platform={contact.platform}
                                username={contact.username}
                              />
                            ))}
                          </motion.div>
                        </CardBody>
                      </Card>
                    </Tab>
                    
                    <Tab
                      key="donate"
                      title={
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>赞助支持</span>
                        </div>
                      }
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {paymentMethods.map((method, index) => (
                          <motion.div
                            key={method.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="bg-default-50/50 backdrop-blur-sm hover:bg-default-100/50 transition-colors">
                              <CardBody>
                                <div className="group relative">
                                <Image
                                    src={`${method.image}`}
                                    alt={`${method.name} QR Code`}
                                    className="w-full rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-center mt-4 font-medium">{method.name}</p>
                              </CardBody>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter className="flex flex-col items-start">
                  <Checkbox
                    checked={neverShow}
                    onChange={(e) => setNeverShow(e.target.checked)}
                    className="mb-4"
                    color="primary"
                  >
                    不再显示
                  </Checkbox>
                  <Button 
                    color="primary" 
                    onPress={handleClose} 
                    className="w-full"
                    size="lg"
                  >
                    关闭
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};