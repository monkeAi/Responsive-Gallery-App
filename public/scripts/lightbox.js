export default class Lightbox {
    static activate() {
        document.body.insertAdjacentHTML("beforeend", `
            <div class="lightbox" id="lightbox" style="display:none;">
                <div class="lightbox__inner">
                    <button type="button" class="lightbox__close">
                        &times;
                    </button>
                    <div class="lightbox__content">
                        <img class="content__img">
                        <p class="content__img-title"></p>
                        <p class="content__img-date"></p>
                    </div>
                </div>
            </div>
        `)
        const lightBox = document.querySelector("#lightbox");
        const btnClose = lightBox.querySelector(".lightbox__close");
        const content = lightBox.querySelector('.lightbox__content');

        const closeLightbox = () => {
            lightBox.style.display = "none";
        }

        lightBox.addEventListener('mousedown', e => {
            if(e.target.matches('#lightbox')){
                closeLightbox();
            }
        })

        btnClose.addEventListener("click", () => {
            closeLightbox();
        })
    }
    static show(Src, Date, Title) {
        const imgSrc = document.querySelector('#lightbox .content__img');
        const imgTitle = document.querySelector('#lightbox .content__img-title');
        const imgDate = document.querySelector('#lightbox .content__img-date');

        document.querySelector('#lightbox').style.display = null;
        console.log(Date)
        imgSrc.src = Src;
        imgTitle.textContent = 'Caption: ', Title;
        imgDate.textContent = 'Uploaded: '+ Date;
    }
}