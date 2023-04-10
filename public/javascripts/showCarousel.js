const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slideActiveClass: "active",
    navigation: {
      nextEl: ".next",
      prevEl: ".prev"
    },
    autoplay: {
      enabled: true,
      delay: 5000
    }
  });
  