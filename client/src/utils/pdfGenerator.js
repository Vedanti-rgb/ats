import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a PDF from a specified HTML element.
 * @param {string} elementId - The ID of the element to capture.
 * @param {string} fileName - The name of the downloaded file.
 */
export const downloadAsPDF = async (elementId, fileName = 'resume.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found.`);
        return false;
    }

    try {
        // Scroll to top to ensure full capture
        const originalScrollPos = window.scrollY;
        window.scrollTo(0, 0);

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            scrollY: -window.scrollY,
            onclone: (clonedDoc) => {
                const allElements = clonedDoc.getElementsByTagName('*');
                for (let i = 0; i < allElements.length; i++) {
                    const el = allElements[i];
                    try {
                        const computed = window.getComputedStyle(el);
                        // Force the computed color and background onto the element's inline style
                        // Browsers automatically convert oklch to rgb/rgba in getComputedStyle
                        if (computed.color) el.style.color = computed.color;
                        if (computed.backgroundColor) el.style.backgroundColor = computed.backgroundColor;
                        if (computed.borderColor) el.style.borderColor = computed.borderColor;
                    } catch (e) {
                        // Ignore elements that can't be styled
                    }
                }
            }
        });

        // Restore scroll position
        window.scrollTo(0, originalScrollPos);

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // A4 dimensions in px at 72 DPI are roughly 595 x 842
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // If content is longer than one page, it will be scaled to fit one page for now.
        // For a more advanced multi-page solution, we would need to slice the canvas.
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
