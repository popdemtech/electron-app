window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    let element = document.getElementById(`${dependency}-version`);
    element.innerText = process.versions[dependency];
  }
});