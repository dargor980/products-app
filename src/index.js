const { app, BrowserWindow, Menu, Accelerator, ipcMain } = require('electron');


const url = require('url');
const path = require('path');

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{

    })
}

let mainWindow

app.on('ready', () =>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
          },
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'),
        protocol: 'file',
        slashes: true
    }))
    const mainMenu = Menu.buildFromTemplate(TemplateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
});

function createNewProductWindow(){
    newProductWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
          },
        width: 400,
        height: 330,
        title: 'Agregar nuevo producto',
    });
    //newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/newProduct.html'),
        protocol: 'file',
        slashes: true,
        
    }));
}

ipcMain.on('product:new', (event, newProduct) => {
    mainWindow.webContents.send('product:new',newProduct);
    newProductWindow.close();
})

const TemplateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Nuevo Producto',
                accelerator: 'Ctrl+N',
                click(){
                    createNewProductWindow();
                }
            },
            {
                label: 'Remover todos los productos',
                click(){
                    mainWindow.webContents.send('products:remove-all');
                }
            },
            {
                label: 'Salir',
                accelerator: process.platform === 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    
];

if(process.env.NODE_ENV !== 'production'){
    TemplateMenu.push({
        label: 'DevTools',
        accelerator: 'Ctrl+D',
        submenu: [
            {
                label: 'Mostrar/ocultar Dev Tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}