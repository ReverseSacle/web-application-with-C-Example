const { ipcRenderer } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const yaml = require('js-yaml');
const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

function createProcess(watch_page,cover_img,title,chapter)
{
    const wrap_card_area = document.getElementById('wrap-card');
    const li_label = document.createElement('li');

    const a_label = document.createElement('a');
    a_label.setAttribute('class','card');
    a_label.setAttribute('href','https://www.iyhdmm.com/' + watch_page);

    const img_label = document.createElement('img');
    img_label.setAttribute('src',cover_img);

    const title_label = document.createElement('p');
    title_label.innerText = title;

    const note_label = document.createElement('p');
    note_label.innerText = '更新至' + chapter;

    a_label.appendChild(img_label);
    li_label.appendChild(a_label);
    li_label.appendChild(title_label);
    li_label.appendChild(note_label);

    wrap_card_area.append(li_label);
}

function createCard(url_link)
{
    const urlPattern = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
    if (false == urlPattern.test(url_link)){ return; }

    const instance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    instance.get(url_link)
    .then(response => {
        const $ = cheerio.load(response.data);
        // 下一个兄弟节点

        const ul_list = $('#search-list').next().children().first();
        ul_list.children('li').each(function(index,el) {
            
            // 获取li中的a标签的src属性
            const page_cover = $(this).children().first();
            const watch_page = page_cover.attr('href');
            const cover_img = page_cover.children().first().attr('src');
            const title = $(this).children().eq(1).children().first().attr('title');
            const chapter = $(this).children().eq(2).children().first().text();
            createProcess(watch_page,cover_img,title,chapter);
        });
    });
}

function pre_searchAndCreate()
{
    const config_file = path.join(process.cwd(),'config.yml');
    if(false == fs.existsSync(config_file))
    {
        ipcRenderer.send('show-notification',{
            title: '通知',
            body: '找不到config.yml文件'
        });
        return;
    }
    var data = null;

    try {
        const loader_file = yaml.load(fs.readFileSync(config_file,'utf8'));
        data = loader_file.websites;
    }
    catch
    {
        ipcRenderer.send('show-notification',{
            title: '通知',
            body: 'config.yml内容为空'
        });
        return;
    }
    data.forEach((url_link) => { createCard(url_link); });
}

document.getElementById('i-commit').addEventListener('click',() => {
    pre_searchAndCreate();
});