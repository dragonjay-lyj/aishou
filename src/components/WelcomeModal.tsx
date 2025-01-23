// src/components/common/WelcomeModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { motion } from 'framer-motion';
import { Checkbox } from "@nextui-org/checkbox";

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasShownModal = localStorage.getItem('welcomeModalShown');
    const dontShowAgainValue = localStorage.getItem('welcomeModalDontShowAgain');

    if (hasShownModal !== 'true' || dontShowAgainValue !== 'true') {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('welcomeModalShown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const onClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('welcomeModalDontShowAgain', 'true');
    }
    setIsOpen(false);
  };

  const handleDontShowAgainChange = (isSelected: boolean) => {
    setDontShowAgain(isSelected);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
      hideCloseButton
      isDismissable={false}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        wrapper: "overflow-hidden",
        body: "overflow-y-auto",
      }}
    >
      <ModalContent as={motion.div}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 relative">
              <motion.h2
                className="text-3xl font-bold text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                欢迎来到艺术平台！
              </motion.h2>
              <motion.p
                className="text-sm text-default-500 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                探索无限的创意与灵感
              </motion.p>
            </ModalHeader>
            <ModalBody>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* 联系信息 */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">联系我</h3>
                  <div className="space-y-4">
                    <p>
                      欢迎通过以下方式联系我：
                    </p>
                    <ul className="space-y-2">
                      <li>
                        <Link isExternal href="https://user.qzone.qq.com/410714630" color="foreground">
                          <span className="font-semibold text-primary">QQ</span>：410714630
                        </Link>
                      </li>
                      <li>
                        <Link isExternal href="mailto:lyjcody@foxmail.com" color="foreground">
                          <span className="font-semibold text-primary">邮箱</span>：lyjcody@foxmail.com
                        </Link>
                      </li>
                      {/* 其他联系方式 */}
                    </ul>
                  </div>
                </div>

                {/* 捐赠信息 */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">支持我们</h3>
                  <div className="space-y-4">
                    <p>
                      您的支持是我们持续创作的动力！如果您喜欢，可以通过以下方式支持我们：
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 微信捐赠 */}
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src="https://lcap-static-saas.nos-eastchina1.126.net/app/微信图片_20250123183048_20250123183119454.jpg"
                          alt="微信捐赠"
                          className="w-full aspect-square object-contain border border-default-200 rounded-lg"
                        />
                        <p className="text-center text-sm">微信扫码支持</p>
                      </motion.div>
                      {/* 支付宝捐赠 */}
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src="https://lcap-static-saas.nos-eastchina1.126.net/app/微信图片_20250123183055_20250123183119321.jpg"
                          alt="支付宝捐赠"
                          className="w-full aspect-square object-contain border border-default-200 rounded-lg"
                        />
                        <p className="text-center text-sm">支付宝扫码支持</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
                </motion.div>
            </ModalBody>
            <ModalFooter className="flex items-center gap-4">
              <Checkbox
                isSelected={dontShowAgain}
                onValueChange={handleDontShowAgainChange}
                size="sm"
              >
                不再提示
              </Checkbox>
              <motion.div
                className="flex-grow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button 
                  color="primary" 
                  onPress={onClose} 
                  className="px-8 font-semibold"
                  radius="sm"
                  size="lg"
                >
                  关闭
                </Button>
              </motion.div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};