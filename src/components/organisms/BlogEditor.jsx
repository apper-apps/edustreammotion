import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import AccessCheckbox from "@/components/molecules/AccessCheckbox";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const BlogEditor = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    featuredImage: initialData?.featuredImage || "",
    accessLevels: initialData?.accessLevels || ["free"]
  });

  const [activeFormat, setActiveFormat] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatText = (format) => {
    const textarea = document.getElementById("content-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = formData.content;

    switch (format) {
      case "bold":
        newText = formData.content.substring(0, start) + `**${selectedText}**` + formData.content.substring(end);
        break;
      case "italic":
        newText = formData.content.substring(0, start) + `*${selectedText}*` + formData.content.substring(end);
        break;
      case "h1":
        newText = formData.content.substring(0, start) + `# ${selectedText}` + formData.content.substring(end);
        break;
      case "h2":
        newText = formData.content.substring(0, start) + `## ${selectedText}` + formData.content.substring(end);
        break;
      case "h3":
        newText = formData.content.substring(0, start) + `### ${selectedText}` + formData.content.substring(end);
        break;
      case "list":
        newText = formData.content.substring(0, start) + `\n- ${selectedText}` + formData.content.substring(end);
        break;
      case "quote":
        newText = formData.content.substring(0, start) + `> ${selectedText}` + formData.content.substring(end);
        break;
      default:
        break;
    }

    handleInputChange("content", newText);
    setActiveFormat(format);
    setTimeout(() => setActiveFormat(null), 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    if (formData.accessLevels.length === 0) {
      toast.error("최소 하나의 접근 권한을 선택해주세요.");
      return;
    }

    const submitData = {
      ...formData,
      featuredImage: formData.featuredImage.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      excerpt: formData.excerpt.trim() || formData.content.substring(0, 150) + "..."
    };

    onSubmit(submitData);
  };

  const formatButtons = [
    { name: "bold", icon: "Bold", label: "굵게" },
    { name: "italic", icon: "Italic", label: "기울임" },
    { name: "h1", icon: "Heading1", label: "제목 1" },
    { name: "h2", icon: "Heading2", label: "제목 2" },
    { name: "h3", icon: "Heading3", label: "제목 3" },
    { name: "list", icon: "List", label: "목록" },
    { name: "quote", icon: "Quote", label: "인용" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="제목"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="블로그 글 제목을 입력하세요"
          required
        />

        <Input
          label="요약"
          value={formData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
          placeholder="글 요약 (비워두면 자동 생성됩니다)"
          helperText="글 요약을 입력하지 않으면 본문 앞 150자로 자동 생성됩니다."
        />

        <Input
          label="대표 이미지 URL"
          value={formData.featuredImage}
          onChange={(e) => handleInputChange("featuredImage", e.target.value)}
          placeholder="대표 이미지 URL (비워두면 기본 이미지 사용)"
          helperText="이미지 URL을 입력하지 않으면 기본 이미지가 사용됩니다."
        />

        <AccessCheckbox
          selectedLevels={formData.accessLevels}
          onChange={(levels) => handleInputChange("accessLevels", levels)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            본문 내용
          </label>
          
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {formatButtons.map(button => (
              <Button
                key={button.name}
                type="button"
                variant={activeFormat === button.name ? "primary" : "ghost"}
                size="sm"
                onClick={() => formatText(button.name)}
                title={button.label}
              >
                <ApperIcon name={button.icon} className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <TextArea
            id="content-editor"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="마크다운 문법을 사용하여 글을 작성하세요.&#10;&#10;**굵게**: **텍스트**&#10;*기울임*: *텍스트*&#10;# 제목 1&#10;## 제목 2&#10;### 제목 3&#10;- 목록 항목&#10;> 인용문"
            rows={20}
            className="font-mono text-sm"
            required
          />
          
          <p className="text-xs text-gray-500">
            마크다운 문법을 지원합니다. 위 툴바 버튼을 사용하거나 직접 입력하세요.
          </p>
        </div>

        {/* Preview */}
        {formData.content && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">미리보기</h3>
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div 
                className="rich-editor"
                dangerouslySetInnerHTML={{
                  __html: convertMarkdownToHtml(formData.content)
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon="Save"
          >
            {initialData ? "수정하기" : "발행하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Simple markdown to HTML converter
function convertMarkdownToHtml(markdown) {
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/\n/g, '<br/>');
}

export default BlogEditor;