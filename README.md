# QR Layout Studio - Feature Guide

This document outlines the features available in the QR Layout Studio application.

## 1. Visual Layout Designer
A powerful sidebar interface allows you to design your sticker/badge layout physically.

*   **Layout Configuration**: Set the physical dimensions (width, height in mm) and background color of your sticker.
*   **Element Management**:
    *   **Add Text**: Insert text fields for static labels (e.g., "Conference Pass") or dynamic variables (e.g., `{{name}}`).
    *   **Add QR Code**: Insert QR codes that can bind to dynamic data (e.g., `{{uuid}}`).
    *   **Delete Element**: Remove unwanted elements from the canvas.
*   **Property Editor**: Click on any element in the list to edit its properties:
    *   **Position & Size**: Fine-tune X, Y, Width, and Height.
    *   **Content**: Edit the text or variable binding.
    *   **Styling**: detailed control over Font Size, Color, and Text Alignment (Left, Center, Right).

## 2. Smart Data Injection
Test your design against real-world data scenarios immediately.

*   **JSON Input**: A dedicated text area to paste your JSON data. Supports both:
    *   **Single Object**: `{"name": "Alice", ...}`
    *   **Array of Objects**: `[{"name": "Alice"}, {"name": "Bob"}]`
*   **JSON File Upload**: Upload a `.json` file from your computer to automatically populate the test data.
*   **Data Pagination**: When an array of data is provided, navigation controls (`< Item 1 of N >`) appear, allowing you to step through and preview each record individually.

## 3. Real-Time Preview
*   **Live Canvas**: The center stage shows a `canvas` rendering of your sticker that updates instantly as you change layout properties or data.
*   **Variable Substitution**: See exactly how long names or different data values look in your design before printing.

## 4. Export & Print
*   **Export Layout**: Save your design configuration as a JSON object (logged to console) for future use.
*   **Download PDF**: Generates a print-ready PDF.
    *   If you provided an **Array** of data, it generates a **multi-page PDF**, with one badge per page.
*   **Download PNG**: Exports the currently previewed badge as a high-quality PNG image.

## 5. Clean & Modern UI
*   **Dark-Themed Interface**: A professional, dark-mode inspired design for comfortable usage.
*   **Responsive Sidebar**: collapsible sections for better organization.
