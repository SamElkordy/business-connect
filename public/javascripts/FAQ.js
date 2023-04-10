// FAQ Logic
let faqCounter = 2;

document.getElementById("faqTab").addEventListener("click", function() {
    // Create a new div element
    const newDiv = document.createElement("div");

    // Set the HTML content of the new div
    newDiv.innerHTML = `
        <div class="faq-container faq-container-${faqCounter} mb-4">
            <div class="mb-3">
                <label class="form-label bc-label" for="faq">FAQ ${faqCounter}</label>
                <input class="form-control" type="text" name="listing[faqs][${faqCounter - 1}][faqQuestion]" placeholder="Question">
            </div>
            <div class="mb-3">
                <textarea class="form-control" type="text" name="listing[faqs][${faqCounter - 1}][faqAnswer]" placeholder="Answer"></textarea>
            </div>
        </div>
    `;

    // Find the last FAQ container and insert the new container after it
    const lastFaqContainer = document.querySelector(`.faq-container-${faqCounter - 1}`);
    if (lastFaqContainer) {
        lastFaqContainer.parentNode.insertBefore(newDiv, lastFaqContainer.nextSibling);
    } else {
        const faqContainer = document.querySelector('.faq-container');
        faqContainer.parentNode.insertBefore(newDiv, faqContainer.nextSibling);
    }

    // Increment the FAQ counter
    faqCounter++;
});
