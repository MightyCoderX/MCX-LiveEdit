const btnSettings = document.getElementById('btnSettings');
const popupSettings = document.getElementById('popupSettings');

//Settings
//const selOrientation = document.getElementById('selOrientation');
const selEditorTheme = document.getElementById('selEditorTheme');
const selEditorMode = document.getElementById('selEditorMode');
const chkAutoRun = document.getElementById('chkAutoRun');
const btnRun = document.getElementById('btnRun');
const numEditorFontSize = document.getElementById('numEditorFontSize');

let settings = {
    editor: {
        theme: 'monokai',
        mode: 'html',
        fontSize: 16
    },

    autoRun: true
};

if(localStorage.length > 0)
{
    loadSettings();
}

setInterval(() => 
{
    saveSettings();    
}, 1000);

btnSettings.addEventListener('click', (e) =>
{
    if(popupSettings.style.display == 'none' || !popupSettings.style.display)
    {
        popupSettings.style.display = 'block';
        popupSettings.focus();
    }
    else
        popupSettings.style.display = 'none';
});

selEditorTheme.addEventListener('change', (e) =>
{
    switch(e.target.value)
    {
        case 'chrome':
            editor.setTheme('ace/theme/chrome');
            settings.editor.theme = e.target.value;
            break;
        case 'monokai':
            editor.setTheme('ace/theme/monokai');
            settings.editor.theme = e.target.value;
            break;
        case 'dracula':
            editor.setTheme('ace/theme/dracula');
            settings.editor.theme = e.target.value;
            break;
        default:
            editor.setTheme('ace/theme/monokai');
            settings.editor.theme = 'monokai';
    }
});

selEditorMode.addEventListener('change', (e) =>
{
    let value = e.target.value.toLowerCase();
    switch(value)
    {
        case 'html':
            setEditorMode('html');
            changeSelectedOption(selEditorTheme, 'monokai');
            settings.editor.mode = value;
            break;
        case 'javascript':
            setEditorMode('javascript');
            changeSelectedOption(selEditorTheme, 'dracula');
            settings.editor.mode = value;
            break;
    }
});

document.body.addEventListener('keyup', (e) =>
{
    if(e.key === 'Escape')
    {
        if(popupSettings.style.display == 'block')
            popupSettings.style.display = 'none';
    }
});

chkAutoRun.addEventListener('change', (e) =>
{
    setAutoRun(e.target.checked);
    settings.autoRun = e.target.checked;
});

btnRun.addEventListener('click', (e) =>
{
    refresh();
});

numEditorFontSize.addEventListener('change', (e) =>
{
    settings.editor.fontSize = e.target.value;
    loadEditorSettings();
});

window.onbeforeunload = function()
{
    saveSettings();
    console.log('Saved Settings!');
    return ('Are you sure you want to leave?');
};

function changeSelectedOption(selectElem, selectElemValue)
{
    for(let option of selectElem.options)
    {
        if(option.value == selectElemValue)
        {
            selectElem.selectedIndex = option.index;
        }
    }
}

function saveSettings()
{
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings()
{
    settings = JSON.parse(localStorage.getItem('settings'));

    changeSelectedOption(selEditorTheme, settings.editor.theme);
    changeSelectedOption(selEditorMode, settings.editor.mode);
    numEditorFontSize.value = settings.editor.fontSize;
    chkAutoRun.checked = settings.autoRun;
}