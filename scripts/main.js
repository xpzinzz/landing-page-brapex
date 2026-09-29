"use strict";

const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

// Menu responsivo

const menuToggle = select("[data-menu-toggle]");
const menu = select("[data-menu]");

if (menuToggle && menu) {
  const closeMenu = () => {
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const willOpen = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Fechar menu" : "Abrir menu",
    );
    document.body.classList.toggle("menu-open", willOpen);
  });

  selectAll("a", menu).forEach((link) =>
    link.addEventListener("click", closeMenu),
  );
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// Estado visual do cabeçalho durante a rolagem

const header = select("[data-header]");
if (header) {
  const heroSection = select(".hero, .inner-hero");
  const navigationLinks = selectAll(".main-nav a", header);
  const normalizePath = (path) => path.replace(/\/index\.html$/, "/");
  const currentPath = normalizePath(window.location.pathname);
  const homeLink = navigationLinks.find((link) => {
    const url = new URL(link.href);

    return normalizePath(url.pathname) === currentPath && !url.hash;
  });
  const navigationSections = navigationLinks
    .map((link) => {
      const url = new URL(link.href);
      const section =
        normalizePath(url.pathname) === currentPath && url.hash
          ? select(url.hash)
          : null;

      return section ? { link, section } : null;
    })
    .filter(Boolean)
    .sort((itemA, itemB) => itemA.section.offsetTop - itemB.section.offsetTop);

  const getHeaderThreshold = () => {
    if (!heroSection) return 24;

    return Math.max(
      24,
      heroSection.offsetTop + heroSection.offsetHeight - header.offsetHeight,
    );
  };

  const updateHeader = () => {
    header.classList.toggle(
      "is-scrolled",
      window.scrollY >= getHeaderThreshold(),
    );
  };

  const updateActiveNavigation = () => {
    if (!navigationSections.length) return;

    const readingPosition =
      window.scrollY +
      header.offsetHeight +
      Math.min(window.innerHeight * 0.2, 160);
    let activeLink = homeLink;

    navigationSections.forEach(({ link, section }) => {
      if (section.offsetTop <= readingPosition) activeLink = link;
    });

    navigationLinks.forEach((link) => {
      const isActive = link === activeLink;

      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute(
          "aria-current",
          link === homeLink ? "page" : "location",
        );
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateNavigation = () => {
    updateHeader();
    updateActiveNavigation();
  };

  updateNavigation();
  window.addEventListener("scroll", updateNavigation, { passive: true });
  window.addEventListener("resize", updateNavigation);
}

// Carrossel da hero

const hero = select("[data-hero]");
if (hero) {
  const slides = selectAll(".hero__slide", hero);
  const dotsWrap = select("[data-hero-dots]", hero);
  let current = 0;
  let timer;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Exibir destaque ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index, true));
    dotsWrap.append(dot);
  });

  const dots = selectAll("button", dotsWrap);

  function showSlide(index, restart = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) =>
      slide.classList.toggle("is-active", slideIndex === current),
    );
    dots.forEach((dot, dotIndex) =>
      dot.classList.toggle("is-active", dotIndex === current),
    );
    if (restart) startTimer();
  }

  function startTimer() {
    window.clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(() => showSlide(current + 1), 7000);
    }
  }

  select("[data-hero-prev]", hero)?.addEventListener("click", () =>
    showSlide(current - 1, true),
  );
  select("[data-hero-next]", hero)?.addEventListener("click", () =>
    showSlide(current + 1, true),
  );
  showSlide(0);
  startTimer();
}

// Cartões empilhados da Política de Gestão

const policyStack = select("[data-policy-stack]");
if (policyStack) {
  const cards = selectAll(".folha", policyStack);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));
  let isVisible = true;
  let frame = null;

  const updatePolicyStack = () => {
    frame = null;

    if (!isVisible || reducedMotion.matches) {
      cards.forEach((card) => {
        card.style.removeProperty("transform");
        card.style.removeProperty("filter");
      });
      return;
    }

    const stickyTop = Number.parseFloat(getComputedStyle(cards[0]).top) || 104;

    cards.forEach((card, index) => {
      let progress = 0;

      if (index < cards.length - 1) {
        const nextTop = cards[index + 1].getBoundingClientRect().top;
        const margin = Number.parseFloat(getComputedStyle(card).marginBottom) || 0;
        const travel = card.offsetHeight + margin;
        progress = clamp((stickyTop + travel - nextTop) / travel, 0, 1);
      }

      card.style.transform = `scale(${1 - progress * 0.085})`;
      card.style.filter = `brightness(${1 - progress * 0.34}) saturate(${1 - progress * 0.18})`;
    });
  };

  const requestStackUpdate = () => {
    if (frame === null) frame = window.requestAnimationFrame(updatePolicyStack);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) requestStackUpdate();
    },
    { threshold: 0 },
  );

  observer.observe(policyStack);
  window.addEventListener("scroll", requestStackUpdate, { passive: true });
  window.addEventListener("resize", requestStackUpdate);
  reducedMotion.addEventListener?.("change", requestStackUpdate);
  requestStackUpdate();
}

// Validação do formulário de contato

const form = select("[data-contact-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = select("[data-form-status]", form);
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Preencha os campos obrigatórios para continuar.";
      status.className = "form-status is-error";
      return;
    }
    status.textContent =
      "Mensagem preparada com sucesso. Integre um serviço de envio para receber os contatos.";
    status.className = "form-status is-success";
    form.reset();
  });
}

// Cadastro na BRAPEX News

const newsletterForm = select("[data-newsletter-form]");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = select("[data-newsletter-status]");

    if (!newsletterForm.checkValidity()) {
      newsletterForm.reportValidity();
      return;
    }

    status.textContent = "Obrigado pelo interesse na BRAPEX News!";
    newsletterForm.reset();
  });
}

// Busca e filtro da página de associados

const associateSearch = select("[data-associate-search]");
const associateFilter = select("[data-associate-filter]");
const associateCards = selectAll(".associate-card");

if (associateSearch && associateFilter && associateCards.length) {
  const count = select("[data-results-count]");
  const empty = select("[data-empty-state]");

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const updateAssociates = () => {
    const query = normalize(associateSearch.value.trim());
    const segment = associateFilter.value;
    let visible = 0;

    associateCards.forEach((card) => {
      const nameMatches = normalize(card.dataset.name).includes(query);
      const segmentMatches =
        segment === "all" || card.dataset.segment.split(" ").includes(segment);
      const show = nameMatches && segmentMatches;
      card.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = `${visible} ${visible === 1 ? "associado encontrado" : "associados encontrados"}`;
    empty.hidden = visible !== 0;
  };

  associateSearch.addEventListener("input", updateAssociates);
  associateFilter.addEventListener("change", updateAssociates);
}

// Ano automático do rodapé

selectAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// Botão de retorno ao topo

selectAll("[data-back-to-top]").forEach((button) => {
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
});
