document.addEventListener('DOMContentLoaded', () => {
    fetch('iptv.json')
        .then(response => response.json())
        .then(data => {
            const channelGrid = document.getElementById('channelGrid');
            data.forEach(channel => {
                const channelCard = document.createElement('div');
                channelCard.classList.add('channel-card');
                channelCard.innerHTML = `
                    <div data-id="${channel.id}" class="channel-link">
                        <img src="${channel.logo}" alt="${channel.name}">
                        <h3>${channel.name}</h3>
                    </div>
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

            document.querySelectorAll('.channel-link').forEach(link => {
                link.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    openPlayerPopup(id);
                });
            });
        });

    const playerPopup = document.getElementById('playerPopup');
    const closeButton = document.querySelector('.close-button');
    const videoElement = document.getElementById('player');
    let hls;

    closeButton.addEventListener('click', () => {
        playerPopup.style.display = 'none';
        videoElement.pause();
        videoElement.removeAttribute('src'); // Remove source to stop HLS stream
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });

    function openPlayerPopup(id) {
        fetch('iptv.json')
            .then(response => response.json())
            .then(data => {
                const channel = data.find(c => c.id === id);
                if (channel) {
                    playerPopup.style.display = 'flex'; // Display popup before setting video source
                    if (Hls.isSupported()) {
                        if (hls) {
                            hls.destroy();
                        }
                        hls = new Hls();
                        hls.loadSource(channel.link);
                        hls.attachMedia(videoElement);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                            videoElement.play();
                        });
                    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                        videoElement.src = channel.link;
                        videoElement.addEventListener('loadedmetadata', function() {
                            videoElement.play();
                        });
                    }
                }
            });
    }
});
