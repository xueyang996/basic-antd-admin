import React from 'react';
import { Editor } from '@/components/TinymceReact';
import { uploadImage } from '@/services/global';

const RichText = props => {
  const { value, onChange } = props;

  const handleEditorChange = (content, editor) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey="hxwv2utnjoz9wzhh430d6lo6pbu1exm8k5sks1coqs79jf9z"
      // tinymceScriptSrc="http://ipark-admin-fe.qa.ii-ai.tech/lib/tinymce.min.js"
      tinymceScriptSrc="https://admin-ipark.ai-indeed.com/lib/tinymce.min.js"
      value={value}
      init={{
        height: 500,
        language: 'zh_CN',
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify \
             bullist numlist outdent indent | removeformat | help',
        images_upload_handler: function (blobInfo, sucCallback, failCallback) {
          const file = blobInfo.blob();
          const formData = new FormData();
          formData.append('file', file, file.name);

          uploadImage(formData)
            .then(res => {
              sucCallback(res.data);
            })
            .catch(err => {
              failCallback('图片上传失败');
            });
        },
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default RichText;
