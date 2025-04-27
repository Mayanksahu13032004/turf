'use client';

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle: string;
  }
  
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-center my-10"
    >
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </motion.div>
  );
};

export default SectionHeader;
