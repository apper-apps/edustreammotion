import React, { useState } from "react";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ReviewComposer = ({ 
  onSubmit, 
  loading = false,
  placeholder = "도전 후기를 공유해주세요...",
  buttonText = "후기 작성",
  maxLength = 500
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("후기 내용을 입력해주세요.");
      return;
    }

    if (content.length > maxLength) {
      toast.error(`최대 ${maxLength}자까지 입력 가능합니다.`);
      return;
    }

    onSubmit(content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 space-y-3">
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              rows={3}
              maxLength={maxLength}
              className="border-0 resize-none focus:ring-0 p-0 text-base placeholder-gray-500"
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {content.length}/{maxLength}
              </div>
              
              <Button
                type="submit"
                size="sm"
                loading={loading}
                disabled={!content.trim() || content.length > maxLength}
                icon="Send"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReviewComposer;