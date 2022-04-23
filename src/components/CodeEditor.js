import './CSS/codeEditor.css';

export const CodeEditor = () => {
  return(
    <div class="offcanvas offcanvas-start codeEditor-container" tabindex="-1" id="codeEditor" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <h3 class="offcanvas-title" id="offcanvasExampleLabel">Code it.</h3>

    </div>
    <div class="offcanvas-body">
      <iframe src='https://codecollab.io/@proj/AirportTrucksMountain' width='100%' height='110%' id='editor'></iframe>
    </div>
  </div>
  );
}