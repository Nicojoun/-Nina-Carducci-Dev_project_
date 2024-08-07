(function() {
  // Définir les options par défaut
  function getDefaultOptions() {
    return {
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };
  }

  // Fonction principale mauGallery
  function mauGallery(element, options) {
    options = Object.assign({}, getDefaultOptions(), options);
    const tagsCollection = [];
    
    element.forEach(el => {
      createRowWrapper(el);

      if (options.lightBox) {
        createLightBox(el, options.lightboxId, options.navigation);
      }

      setListeners(options);

      const galleryItems = el.querySelectorAll(".gallery-item");
      galleryItems.forEach(item => {
        responsiveImageItem(item);
        moveItemInRowWrapper(item);
        wrapItemInColumn(item, options.columns);

        const theTag = item.getAttribute("data-gallery-tag");
        if (options.showTags && theTag && !tagsCollection.includes(theTag)) {
          tagsCollection.push(theTag);
        }
      });

      if (options.showTags) {
        showItemTags(el, options.tagsPosition, tagsCollection);
      }

      el.style.display = 'block';
    });
  }

  // Méthodes
  function createRowWrapper(element) {
    if (!element.querySelector('.row')) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'gallery-items-row row';
      element.appendChild(rowDiv);
    }
  }

  function wrapItemInColumn(element, columns) {
    let columnClass = '';
    if (typeof columns === 'number') {
      columnClass = ` col-${Math.ceil(12 / columns)}`;
    } else if (typeof columns === 'object') {
      if (columns.xs) columnClass += ` col-${Math.ceil(12 / columns.xs)}`;
      if (columns.sm) columnClass += ` col-sm-${Math.ceil(12 / columns.sm)}`;
      if (columns.md) columnClass += ` col-md-${Math.ceil(12 / columns.md)}`;
      if (columns.lg) columnClass += ` col-lg-${Math.ceil(12 / columns.lg)}`;
      if (columns.xl) columnClass += ` col-xl-${Math.ceil(12 / columns.xl)}`;
    } else {
      console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
      return;
    }

    const columnDiv = document.createElement('div');
    columnDiv.className = `item-column mb-4${columnClass}`;
    element.parentNode.insertBefore(columnDiv, element);
    columnDiv.appendChild(element);
  }

  function moveItemInRowWrapper(element) {
    const rowWrapper = document.querySelector('.gallery-items-row');
    rowWrapper.appendChild(element);
  }

  function responsiveImageItem(element) {
    if (element.tagName === 'IMG') {
      element.classList.add('img-fluid');
    }
  }

  function openLightBox(element, lightboxId) {
    const lightbox = document.getElementById(lightboxId);
    if (lightbox) {
      const lightboxImage = lightbox.querySelector('.lightboxImage');
      if (lightboxImage) {
        lightboxImage.src = element.src;
      }
      // Note: You would need to manually implement the modal functionality.
    }
  }

  function prevImage(lightboxId) {
    let activeImage = null;
    const galleryItems = document.querySelectorAll('img.gallery-item');
    galleryItems.forEach(img => {
      if (img.src === document.querySelector('.lightboxImage').src) {
        activeImage = img;
      }
    });

    const activeTag = document.querySelector('.tags-bar .active-tag')?.getAttribute('data-images-toggle');
    const imagesCollection = [];
    const itemColumns = document.querySelectorAll('.item-column');

    itemColumns.forEach(column => {
      const img = column.querySelector('img');
      if (img && (activeTag === "all" || img.getAttribute('data-gallery-tag') === activeTag)) {
        imagesCollection.push(img);
      }
    });

    const index = imagesCollection.indexOf(activeImage) - 1;
    const next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
    if (next) {
      document.querySelector('.lightboxImage').src = next.src;
    }
  }

  function nextImage(lightboxId) {
    let activeImage = null;
    const galleryItems = document.querySelectorAll('img.gallery-item');
    galleryItems.forEach(img => {
      if (img.src === document.querySelector('.lightboxImage').src) {
        activeImage = img;
      }
    });

    const activeTag = document.querySelector('.tags-bar .active-tag')?.getAttribute('data-images-toggle');
    const imagesCollection = [];
    const itemColumns = document.querySelectorAll('.item-column');

    itemColumns.forEach(column => {
      const img = column.querySelector('img');
      if (img && (activeTag === "all" || img.getAttribute('data-gallery-tag') === activeTag)) {
        imagesCollection.push(img);
      }
    });

    const index = imagesCollection.indexOf(activeImage) + 1;
    const next = imagesCollection[index] || imagesCollection[0];
    if (next) {
      document.querySelector('.lightboxImage').src = next.src;
    }
  }

  function createLightBox(gallery, lightboxId, navigation) {
    const modalHtml = `
      <div class="modal fade" id="${lightboxId || 'galleryLightbox'}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
              <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>
              ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
            </div>
          </div>
        </div>
      </div>`;
    gallery.insertAdjacentHTML('beforeend', modalHtml);
  }

  function showItemTags(gallery, position, tags) {
    let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
    tags.forEach(value => {
      tagItems += `<li class="nav-item active"><span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
    });
    const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
    if (position === "bottom") {
      gallery.insertAdjacentHTML('beforeend', tagsRow);
    } else if (position === "top") {
      gallery.insertAdjacentHTML('afterbegin', tagsRow);
    } else {
      console.error(`Unknown tags position: ${position}`);
    }
  }

  function filterByTag() {
    if (this.classList.contains("active-tag")) return;
    document.querySelector('.active-tag')?.classList.remove('active', 'active-tag');
    this.classList.add('active-tag', 'active');

    const tag = this.getAttribute('data-images-toggle');
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      const parent = item.closest('.item-column');
      parent.style.display = 'none';
      if (tag === "all" || item.getAttribute('data-gallery-tag') === tag) {
        parent.style.display = 'block';
      }
    });
  }

  function setListeners(options) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', function() {
        if (options.lightBox && this.tagName === 'IMG') {
          openLightBox(this, options.lightboxId);
        }
      });
    });

    document.querySelector('.gallery')?.addEventListener('click', function(event) {
      if (event.target.classList.contains('nav-link')) {
        filterByTag.call(event.target);
      } else if (event.target.classList.contains('mg-prev')) {
        prevImage(options.lightboxId);
      } else if (event.target.classList.contains('mg-next')) {
        nextImage(options.lightboxId);
      }
    });
  }

  // Exposer la fonction mauGallery globalement
  window.mauGallery = mauGallery;
})();

export {mauGallery}