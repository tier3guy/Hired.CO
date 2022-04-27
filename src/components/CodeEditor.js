import './CSS/codeEditor.css';

export const CodeEditor = () => {
  return(
    <div class="p-0 offcanvas offcanvas-start codeEditor-container" tabindex="-1" id="codeEditor" aria-labelledby="offcanvasExampleLabel">
      <div class="m-0 p-0 offcanvas-body">
        <iframe class='m-0' src='https://codecollab.io/@avinash62/Hired.co' width='100%' height='115%' id='editor'></iframe>
      </div>
    </div>
  );
}