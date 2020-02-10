const editorElem = document.getElementById('editor');
const displayElem = document.getElementById('display');

const editor = ace.edit(editorElem);
editor.renderer.setScrollMargin(10, 10);

editor.commands.addCommand({
    name: "Run",
    exec: () => refresh(),
    bindKey: {mac: "cmd-r", win: "ctrl-r"}
})

let refresh;

loadEditorSettings();

setAutoRun(chkAutoRun.checked);

Split(['#editor', '#display']);

function setEditorMode(mode)
{
    switch(mode)
    {
        case 'html':
            window.addEventListener('load', async () => {
                let response = await (await fetch('./boilerplate.ht')).text();
                editor.setValue(response);
                editor.gotoLine(9, 8);
                editor.focus();
            });
            editor.getSession().setMode('ace/mode/html');
            editor.setTheme('ace/theme/monokai');
            refresh = () =>
            {
                displayElem.srcdoc = editor.getValue();
            }
            break;

        case 'javascript':
            editor.getSession().setMode('ace/mode/javascript');
            editor.setTheme('ace/theme/dracula');
            setAutoRun(false);
            refresh = () =>
            {
                if(displayElem.srcdoc.includes('$js'))
                {
                    displayElem.srcdoc = displayElem.srcdoc.replace('$js', `<script id="editorScript">${editor.getValue()}</script>`);
                }
                else
                {
                    let regexp = new RegExp('<script id="editorScript">(.*?)<\/script>', 'gs');
                    displayElem.srcdoc = displayElem.srcdoc.replace(regexp, `<script id="editorScript">${editor.getValue()}</script>`);
                }
            }
            setFrameAsConsole();
            break;

        default:
            console.error(`Invalid '${mode}' Mode: Allowed 'javascript' and 'html'`);
            break;
    }
}

function onChange()
{
    setTimeout(() =>
    {
        refresh();
    }, 10);
}

function setAutoRun(autoRun)
{
    if(autoRun)
    {
        editor.getSession().on('change', onChange);
    }
    else
    {
        editor.getSession().off('change', onChange);
    }

    btnRun.style.display = (!autoRun) ? "block" : "none";
}

function loadEditorSettings()
{
    setAutoRun(settings.autoRun);
    editor.setOptions({
        fontFamily: 'Source Code Pro',
        fontSize: `${settings.editor.fontSize}px`
    });
    editor.setTheme('ace/theme/' + settings.editor.theme);
    setEditorMode(settings.editor.mode);
}

async function setFrameAsConsole()
{
    let response = await (await fetch('./console.ht')).text();
    displayElem.srcdoc = response;
}