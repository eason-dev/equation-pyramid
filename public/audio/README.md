# Audio Files Directory

Place your background music files in this directory.

## Supported Formats
- MP3 (.mp3) - Recommended for best compatibility
- WAV (.wav) - Good quality but larger file size
- OGG (.ogg) - Good compression and quality
- M4A (.m4a) - Apple format

## Required Files
The app uses two separate background music tracks:

- `main-background-music.ogg` - Plays during menu, settings, and game over screens
- `ticking.ogg` - Plays during guessing phase only

## Music Layering Logic
The app uses a layered audio approach:

**Main Menu Music** (`main-background-music.ogg`):
- Plays continuously throughout the entire game experience
- Continues playing during guessing phase as background layer
- Automatically trims first 28ms for cleaner start

**Ticking Sound** (`ticking.ogg`):
- Layers on top of main music during guessing phase only
- Stops when results are shown (main music continues)
- Automatically trims first 28ms and last 10ms for cleaner looping

## Recommendations
- Keep file sizes under 5MB for faster loading
- Use 128-192 kbps MP3 encoding for good quality/size balance
- Ensure both audio tracks loop seamlessly for continuous playback
- Design ticking sound to complement (not overpower) the main music
- For ticking sound: Export with precise timing to avoid artifacts at beginning/end
- OGG format provides good compression and quality for both audio files
- Ticking sound should add urgency while allowing main music to remain audible
- Test volume balance to ensure both tracks work well together when layered

## Example Structure
```
public/audio/
├── main-background-music.ogg    # Menu/settings background music
├── ticking.ogg                  # Guessing phase music (ticking sound)
└── victory-sound.mp3            # Optional: Victory/completion sound
```

## Usage
- **Main music** plays continuously throughout the entire game
- **Ticking sound** layers on top during active guessing (when a player presses the answer button)
- Main music continues playing while ticking sound is added during guessing phase
- Ticking sound stops when results are shown (main music keeps playing)
- Players can control volume and play/pause using the music button in the footer
- The music button shows which track is currently prominent (Menu Music/Game Music)
- Volume settings are shared between both tracks
- Layered audio creates urgency during guessing while maintaining musical continuity 