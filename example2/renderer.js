document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    await window.darkMode.toggle()
})

const text_block = document.getElementById('textblock');
text_block.style.height = window.innerHeight + 'px';