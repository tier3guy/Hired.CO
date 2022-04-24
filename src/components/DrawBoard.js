import './CSS/drawBoard.css';

export const DrawBoard = () => {
  return (
    <div class="p-0 offcanvas offcanvas-top" tabindex="-1" id="drawborad-container" aria-labelledby="offcanvasTopLabel">
    <div class="m-0 p-0 offcanvas-body">
      <iframe class="m-0" src="https://app.sketchtogether.com/s/sketch/YAROT.1.1/" id="board" width="120%" height="100%"></iframe>
    </div>
  </div>
  );
}