Please manually create the file src/components/ui/response-modal.tsx in the project. Paste the provided modal component code inside that file.

This component should:
• Render the full, untruncated AI response in a large, premium card/modal, centered on screen
• Blur/darken the rest of the UI (backdrop-blur or backdrop-filter) while open
• Have generous padding and max width (max-w-2xl or 700px), with selectable, easy-to-read text
• Include a prominent copy button and a clear close (“X”) button
• Animate in with a fade + slight scale effect
• On mobile, modal should be full-screen
• No bold colors—just clean, premium style

After creating this file, please integrate it with the main response panel so that when the user clicks “View Full Response,” the modal opens with the relevant model’s response, and the background is blurred. Closing the modal should always return to the compare panel in the exact scroll/context position.

Result:
Users can always click to expand any long response in a premium modal for better reading/copying, on any model, without breaking compare context.

If you encounter tool/file system issues, just create the file manually and confirm with a checklist that integration is done.