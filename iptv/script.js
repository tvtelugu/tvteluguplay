document.addEventListener('DOMContentLoaded', () => {
    fetch('iptv.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Log the fetched data
            loadChannels(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function loadChannels(channels) {
    const channelGrid = document.getElementById('channelGrid');
    channelGrid.innerHTML = ''; // Clear existing content
    channels.forEach(channel => {
        console.log('Loading channel:', channel); // Log each channel
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        channelCard.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}" class="channel-logo">
            <div class="channel-name">${channel.name}</div>
        `;
        channelCard.addEventListener('click', () => openPopup(channel.link));
        channelGrid.appendChild(channelCard);
    });
}

function openPopup(link) {
    const popup = document.getElementById('popupPlayer');
    const videoPlayer = document.getElementById('videoPlayer');

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(link);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoPlayer.play();
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = link;
        videoPlayer.addEventListener('loadedmetadata', () => {
            videoPlayer.play();
        });
    }

    popup.style.display = 'block';
    const player = new Plyr(videoPlayer);
}

function closePopup() {
    const popup = document.getElementById('popupPlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.pause();
    popup.style.display = 'none';
}

function filterChannels() {
    const searchBar = document.getElementById('searchBar');
    const filter = searchBar.value.toLowerCase();
    const channelCards = document.querySelectorAll('.channel-card');
    channelCards.forEach(card => {
        const channelName = card.querySelector('.channel-name').textContent.toLowerCase();
        if (channelName.includes(filter)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
