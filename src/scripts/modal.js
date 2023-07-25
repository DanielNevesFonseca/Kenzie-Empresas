export function closeModal(modalControllerClass){
  const modalController = document.querySelector(`.${modalControllerClass}`);
  const closeButton = document.querySelector(`.${modalControllerClass} .button-cancel`);

  closeButton.addEventListener('click', () => {
    modalController.close();
  })
}