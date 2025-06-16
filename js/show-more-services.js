document.addEventListener("DOMContentLoaded", function () {
  const showMoreBtn = document.getElementById("show-more-services");
  const hiddenServices = document.querySelectorAll(
    ".services-grid .mobile-hide"
  );
  if (showMoreBtn && hiddenServices.length > 0) {
    showMoreBtn.addEventListener("click", function () {
      hiddenServices.forEach((service) => {
        service.classList.remove("mobile-hide");
      });
      showMoreBtn.style.display = "none";
    });
  }
});
