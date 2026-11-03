async function fetchYoutubeMetadata(ytId) {
  if (!ytId || typeof ytId !== 'string' || ytId.length < 5) {
    return { status: 400, valid: false, error: 'Invalid ID' };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) {
      return { status: res.status, valid: false };
    }
    const oembed = await res.json();

    // Now fetch watch page to extract duration
    let durationStr = 'Unknown';
    let totalSeconds = 0;
    try {
      const wRes = await fetch(`https://www.youtube.com/watch?v=${ytId}`, { signal: AbortSignal.timeout(3500) });
      if (wRes.ok) {
        const pageData = await wRes.text();
        const durMatch = pageData.match(/"approxDurationMs":"(\d+)"/);
        if (durMatch) {
          const ms = parseInt(durMatch[1]);
          totalSeconds = Math.floor(ms / 1000);
          const mins = Math.floor(totalSeconds / 60);
          const secs = totalSeconds % 60;
          durationStr = `${mins} mins ${secs < 10 ? '0' : ''}${secs} secs`;
        }
      }
    } catch (e) {
      // duration extraction failed or timed out, but video is valid
    }

    return {
      valid: true,
      status: 200,
      id: ytId,
      title: oembed.title,
      author: oembed.author_name,
      duration: durationStr,
      seconds: totalSeconds
    };
  } catch (err) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError';
    return { status: isTimeout ? 408 : 0, valid: false, error: err.message };
  }
}

module.exports = { fetchYoutubeMetadata };
