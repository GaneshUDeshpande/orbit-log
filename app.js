async function updateMission() {
  const response = await fetch('./mission.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Mission data could not load (${response.status})`);
  }

  const { status, transmissions } = await response.json();
  const current = transmissions[status];
  if (!current) {
    throw new Error(`Unknown mission status: ${status}`);
  }

  const signalReceived = status === 'signal_received';
  const badgeStyle = signalReceived ? 'complete' : 'pending';

  document.querySelector('#transmission-title').textContent = current.title;
  document.querySelector('#transmission-message').textContent = current.message;

  const missionBadge = document.querySelector('#mission-status');
  missionBadge.className = `badge ${badgeStyle}`;
  missionBadge.textContent = signalReceived ? 'Signal received' : 'Awaiting first signal';

  const milestone = document.querySelector('#signal-milestone');
  milestone.className = `badge ${badgeStyle}`;
  milestone.textContent = signalReceived ? 'Complete' : 'Awaiting';
}

updateMission().catch(console.error);
