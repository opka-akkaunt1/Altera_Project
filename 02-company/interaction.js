(function initializeCompany() {
  const { find, onClick } = window.PortfolioDemo;
  const filter = find("#project-filter");
  const detail = find("#project-detail");
  const photo = find("#project-photo");
  const projects = document.querySelectorAll(".contractor-project");

  function showPhoto(frame) {
    photo.dataset.frame = String(frame);
    find("#photo-count").textContent = frame + " / 2";
    find("#previous-photo").disabled = frame === 1;
    find("#next-photo").disabled = frame === 2;
    photo.setAttribute(
      "aria-label",
      find("#project-title").textContent + ", изображение " + frame + " из 2",
    );
  }

  filter.addEventListener("change", () => {
    for (const project of projects) {
      project.hidden =
        filter.value !== "all" && project.dataset.kind !== filter.value;
    }
  });

  for (const project of projects) {
    project.querySelector("button").addEventListener("click", () => {
      photo.dataset.scene = project.querySelector("[data-scene]").dataset.scene;
      find("#project-title").textContent =
        project.querySelector("h3").textContent;
      find("#project-area").textContent =
        project.querySelector(".project-area").textContent;
      find("#project-works").textContent =
        project.querySelector(".project-works").textContent;
      find("#project-stages").replaceChildren(
        project.querySelector("template").content.cloneNode(true),
      );
      showPhoto(1);
      detail.showModal();
    });
  }

  onClick("previous-photo", () => showPhoto(1));
  onClick("next-photo", () => showPhoto(2));
  onClick("close-dialog", () => detail.close());
})();
