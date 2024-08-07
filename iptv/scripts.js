document.addEventListener('DOMContentLoaded', () => {
    fetch('iptv.json')
        .then(response => response.json())
        .then(data => {
            const channelGrid = document.getElementById('channelGrid');
            data.forEach(channel => {
                const channelCard = document.createElement('div');
                channelCard.classList.add('channel-card');
                channelCard.innerHTML = `
                    <a href="player.html?id=${channel.id}">
                        <img src="${channel.logo}" alt="${channel.name}">
                        <h3>${channel.name}</h3>
                    </a>
                `;
                channelGrid.appendChild(channelCard);
            });

            document.getElementById('searchInput').addEventListener('input', function() {
                const searchValue = this.value.toLowerCase();
                document.querySelectorAll('.channel-card').forEach(card => {
                    const channelName = card.querySelector('h3').textContent.toLowerCase();
                    if (channelName.includes(searchValue)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
});
