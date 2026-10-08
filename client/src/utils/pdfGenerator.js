import html2canvas from 'html2canvas-pro';
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
        // Wait for fonts to finish loading so layout doesn't shift mid-capture
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Find scrollable parents and save their scroll positions
        const scrollableParents = [];
        let p = element.parentElement;
        while (p) {
            if (p.scrollHeight > p.clientHeight) {
                scrollableParents.push({
                    element: p,
                    scrollTop: p.scrollTop,
                    scrollLeft: p.scrollLeft
                });
                p.scrollTop = 0;
                p.scrollLeft = 0;
            }
            p = p.parentElement;
        }

        // Scroll to top to ensure full capture
        const originalScrollPos = window.scrollY;
        window.scrollTo(0, 0);

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.margin = '0';
                    clonedElement.style.height = 'auto';
                    clonedElement.style.maxHeight = 'none';
                    clonedElement.style.overflow = 'visible';

                    let parent = clonedElement.parentElement;
                    while (parent) {
                        const cs = clonedDoc.defaultView.getComputedStyle(parent);
                        if (cs.overflow !== 'visible' || cs.overflowY !== 'visible' || cs.overflowX !== 'visible') {
                            parent.style.overflow = 'visible';
                            parent.style.overflowY = 'visible';
                            parent.style.overflowX = 'visible';
                        }
                        if (cs.maxHeight !== 'none') {
                            parent.style.maxHeight = 'none';
                        }
                        // Note: no position or left/top overrides here
                        parent = parent.parentElement;
                    }
                }


                const allElements = clonedDoc.querySelectorAll('*');
                const colorProps = [
                    'color', 'backgroundColor',
                    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
                    'outlineColor', 'textDecorationColor', 'caretColor'
                ];

                allElements.forEach((el) => {
                    try {
                        const computed = window.getComputedStyle(el);

                        colorProps.forEach((prop) => {
                            const val = computed[prop];
                            if (val) el.style[prop] = val;
                        });

                        // boxShadow and background/backgroundImage can contain oklch too
                        // (gradients, shadow colors) — html2canvas chokes on these, so
                        // strip them rather than pass through broken values
                        if (computed.boxShadow && computed.boxShadow.includes('oklch')) {
                            el.style.boxShadow = 'none';
                        } else if (computed.boxShadow) {
                            el.style.boxShadow = computed.boxShadow;
                        }

                        if (computed.backgroundImage && computed.backgroundImage.includes('oklch')) {
                            el.style.backgroundImage = 'none';
                        }

                        // SVG icons using currentColor/fill/stroke with oklch
                        if (el.tagName === 'svg' || el.tagName === 'path' ||
                            el.tagName === 'circle' || el.tagName === 'rect') {
                            if (computed.fill && computed.fill.includes('oklch')) {
                                el.style.fill = 'currentColor';
                            }
                            if (computed.stroke && computed.stroke.includes('oklch')) {
                                el.style.stroke = 'currentColor';
                            }
                        }
                    } catch {
                        // Ignore elements that can't be styled
                    }
                });
            }
        });

        // Restore scroll position
        window.scrollTo(0, originalScrollPos);
        scrollableParents.forEach(({ element: el, scrollTop, scrollLeft }) => {
            el.scrollTop = scrollTop;
            el.scrollLeft = scrollLeft;
        });
        console.log('Captured canvas:', canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/png', 1.0);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Scale image to fit page width, compute full scaled height
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Additional pages if content is taller than one A4 page
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(fileName);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};