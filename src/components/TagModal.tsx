import * as Dialog from '@radix-ui/react-dialog';
import { useStore, Tag } from '../store';
import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, Globe, ExternalLink, Ban } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { api } from '../lib/api';

const commonIcons = [
  'Globe', 'Star', 'Heart', 'Zap', 'Book', 'Briefcase', 'Coffee', 'Code', 'Cpu', 'Database', 
  'FileText', 'Folder', 'Home', 'Image', 'Link', 'Map', 'MessageSquare', 'Music', 'Paperclip', 
  'Play', 'Search', 'Settings', 'ShoppingBag', 'Smile', 'Sun', 'Tag', 'Terminal', 'Tool', 
  'TrendingUp', 'Truck', 'Tv', 'Umbrella', 'User', 'Video', 'Watch', 'Wifi', 'Mail', 'Calendar',
  'CreditCard', 'Gift', 'Key', 'Lock', 'Package', 'Phone', 'Printer', 'Share2', 'Shield', 'Tool'
];

const diceBearStyles = ['adventurer', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'croodles', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists', 'open-peeps', 'personas', 'pixel-art', 'shapes'];

const avataaarsOptions = [
  { name: 'Felix', seed: 'Felix' },
  { name: 'Lucy', seed: 'Lucy' },
  { name: 'Light', seed: 'Light' },
  { name: 'Medium', seed: 'Medium' },
  { name: 'Dark', seed: 'Dark' },
  { name: 'Auburn', seed: 'Auburn' },
  { name: 'Black', seed: 'Black' },
  { name: 'Blonde', seed: 'Blonde' },
  { name: 'Brown', seed: 'Brown' },
  { name: 'Red', seed: 'Red' },
];

function IconifySearch({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchIcons = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=30`);
      const data = await res.json();
      setResults(data.icons || []);
    } catch (e) {
      console.error('Failed to search iconify:', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(searchIcons, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchIcons]);

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">搜索中...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-6 gap-1">
          {results.map((iconName) => (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className="p-1.5 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
              title={iconName}
            >
              <img
                src={`https://api.iconify.design/${iconName.split(':')[0]}/${iconName.split(':')[1]}.svg?width=18&height=18`}
                alt={iconName}
                className="w-4 h-4"
              />
            </button>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">未找到图标</div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">输入关键词搜索</div>
      )}
    </div>
  );
}

function DiceBearSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const [style, setStyle] = useState('avataaars');
  const seeds = searchQuery.trim() 
    ? [searchQuery.trim(), ...Array.from({ length: 11 }, (_, i) => `seed${i + 1}`)]
    : Array.from({ length: 12 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="space-y-2">
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none"
      >
        {diceBearStyles.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
        <div className="grid grid-cols-4 gap-1">
          {seeds.map((seed, idx) => (
            <button
              key={`${seed}-${idx}`}
              onClick={() => onSelect(`dicebear:${style}:${seed}`)}
              className="p-1.5 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
            >
              <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt={seed} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvataaarsSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const filteredOptions = searchQuery.trim()
    ? [...avataaarsOptions, { name: searchQuery.trim(), seed: searchQuery.trim() }]
    : avataaarsOptions;

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-3 gap-1">
        {filteredOptions.map((opt) => (
          <button
            key={opt.seed}
            onClick={() => onSelect(`avataaars:${opt.seed}`)}
            className="p-1.5 flex flex-col items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opt.seed}`} alt={opt.name} className="w-6 h-6" />
            <span className="text-[9px] text-gray-500 mt-0.5">{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const tagIconLibraryIcons: Record<string, string[]> = {
  lucide: ['globe', 'star', 'heart', 'zap', 'book', 'briefcase', 'coffee', 'code', 'cpu', 'database', 'file-text', 'folder', 'home', 'image', 'link', 'map', 'message-square', 'music', 'paperclip', 'play', 'search', 'settings', 'shopping-bag', 'smile', 'sun', 'tag', 'terminal', 'tool', 'trending-up', 'truck', 'tv', 'umbrella', 'user', 'video', 'watch', 'wifi', 'mail', 'calendar', 'credit-card', 'gift', 'key', 'lock', 'package', 'phone', 'printer', 'share2', 'shield', 'bell', 'bookmark', 'calendar-check', 'check-circle', 'clipboard', 'clock', 'cloud', 'code-2', 'compass', 'copy', 'edit', 'eye', 'file', 'flag', 'folder-open', 'hash', 'headphones', 'inbox', 'layers', 'layout', 'list', 'loader', 'mic', 'monitor', 'moon', 'mouse', 'move', 'music-2', 'navigation', 'paper-plane', 'pause', 'pie-chart', 'power', 'repeat', 'rewind', 'save', 'send', 'server', 'skip-back', 'skip-forward', 'slash', 'sliders', 'smartphone', 'speaker', 'square', 'stack', 'star', 'target', 'thumbs-up', 'timer', 'trash', 'triangle', 'upload', 'volume-2', 'wallet', 'wind', 'x-circle', 'you-tube', 'activity', 'airplane', 'anchor', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'award', 'axe', 'baby', 'backpack', 'bandage', 'battery', 'bean', 'bed', 'bike', 'binary', 'birthday', 'blender', 'bomb', 'book-2', 'book-open', 'boots', 'box', 'boxing', 'brush', 'bucket', 'bug', 'building', 'bulb', 'bullseye', 'bus', 'cabin', 'cable', 'cactus', 'cake', 'calculator', 'calendar-days', 'camera', 'candy', 'car', 'carrot', 'castle', 'cat', 'charging', 'chat', 'check', 'check-2', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle', 'citrus', 'clapperboard', 'click', 'clipboard-check', 'clipboard-list', 'cloud-lightning', 'cloud-moon', 'cloud-off', 'cloud-rain', 'cloud-snow', 'cloud-sun', 'clouds', 'club', 'code-editor', 'codepen', 'codesandbox', 'coffin', 'collapse', 'color-picker', 'columns', 'compass-2', 'cone', 'context-menu', 'control', 'cookie', 'copy-check', 'copy-plus', 'copyright', 'cpu-2', 'creative-commons', 'crop', 'crosshair', 'cube', 'curly-braces', 'curly-brackets', 'currency', 'cylinder', 'dance', 'dashboard', 'database-2', 'date', 'deer', 'delta', 'desk', 'diamond', 'dices', 'disc', 'divide', 'dna', 'dog', 'dollar-sign', 'dollipop', 'door', 'download', 'drag-horizontal', 'drag-vertical', 'drama', 'dribbble', 'droplet', 'droplets', 'drum', 'dumbbell', 'ear', 'eclipse', 'egg', 'elevator', 'emoji', 'equal', 'eraser', 'euro', 'expand', 'external-link', 'eye-2', 'eye-off', 'feather', 'ferry', 'fingerprint', 'fish', 'flag-2', 'flame', 'flask', 'flip-horizontal', 'flip-vertical', 'flower', 'flower-2', 'folder-cog', 'folder-dot', 'folder-input', 'folder-lock', 'folder-minus', 'folder-open-2', 'folder-plus', 'folder-root', 'folder-search', 'folder-settings', 'folders', 'footprints', 'fork', 'form-input', 'forward', 'frame', 'framer', 'frown', 'gamepad', 'gantt-chart', 'gem', 'ghost', 'gift-2', 'git-branch', 'git-commit', 'git-compare', 'git-merge', 'git-pull-request', 'git-repo', 'github', 'gitlab', 'glass', 'glasses', 'globe-2', 'goggles', 'golf', 'graduation-cap', 'grid', 'guitar', 'hammer', 'hand', 'hand-metal', 'hard-drive', 'hash-2', 'haze', 'headphone-2', 'headset', 'heart-handshake', 'hearts', 'help-circle', 'hexagon', 'high-voltage', 'hiking', 'history', 'hockey', 'home-2', 'hospital', 'hot', 'hotel', 'hourglass', 'ice-cream', 'id-card', 'image-2', 'image-plus', 'images', 'import', 'inbox-2', 'info', 'instagram', 'int', 'italic', 'japanese-yen', 'joystick', 'kayaking', 'key-2', 'keyboard', 'laptop', 'lasso', 'laugh', 'lawn-mower', 'leaf', 'leaf-2', 'library', 'life-buoy', 'lightbulb', 'lightning-2', 'linkedin', 'link-2', 'list-checks', 'list-chevrons', 'list-minus', 'list-plus', 'list-todo', 'list-tree', 'loader-2', 'locate', 'location', 'lock-2', 'log-in', 'log-out', 'lollipop-2', 'love', 'magnet', 'mail-2', 'mailbox', 'map-2', 'map-pin', 'marker', 'martini', 'maximize', 'medal', 'megaphone', 'megaphone-2', 'meh', 'message-circle-2', 'message-circle-3', 'message-circle-4', 'message-square-2', 'message-square-3', 'message-square-4', 'mic-2', 'minimize', 'minus', 'mist', 'mona-lisa', 'monitor-2', 'monitor-smartphone', 'monitor-speaker', 'moon-2', 'mountain', 'mouse-2', 'mouse-pointer', 'mouse-pointer-2', 'move-2', 'move-3', 'move-4', 'music-2', 'music-4', 'navigate', 'nfc', 'network', 'news', 'next', 'nibble', 'no-copyright', 'no-credits', 'notebook', 'notepad', 'notification', 'npm', 'number-0', 'number-1', 'number-2', 'number-3', 'number-4', 'number-5', 'number-6', 'number-7', 'number-8', 'number-9', 'nutrition', 'octagon', 'option', 'orbit', 'package-2', 'packets', 'padlock', 'page-break', 'paint-brush', 'paint-bucket', 'palette', 'panels-top-left', 'paperclip-2', 'parentheses', 'parking', 'party-popper', 'paste', 'pause-2', 'paw-print', 'payrock', 'peace', 'pen-tool', 'percent', 'phone-call', 'phone-2', 'phone-forward', 'phone-incoming', 'phone-off', 'phone-outgoing', 'pill', 'pin', 'pipette', 'plane', 'plane-2', 'plane-takeoff', 'play-circle', 'play-square', 'playlist', 'plugs', 'plus', 'podcast', 'pointer', 'popup', 'presentation', 'previous', 'printer-2', 'projector', 'puzzle', 'question-mark', 'radar', 'radio', 'receipt', 'rectangle', 'recycle', 'redo', 'refresh-cw', 'repeat-2', 'repeat-once', 'replace', 'report', 'ruler', 'ruler-2', 'running', 'rust', 'sad', 'sailboat', 'save-2', 'scaling', 'scan', 'scan-line', 'scatter', 'school', 'scissors', 'screen-share', 'scroll', 'search-2', 'search-code', 'search-narrow', 'search-wide', 'section', 'security', 'selfie', 'send-2', 'server-2', 'settings-2', 'settings-2-1', 'share', 'share-2', 'shield-2', 'shield-2', 'shield-check', 'shield-close', 'shield-off', 'ship', 'shirt', 'shopping-cart', 'shopping-cart-2', 'shuffle', 'sidebar', 'signal', 'signal-2', 'sign-in', 'sign-out', 'siren', 'skateboard', 'skew', 'slash-2', 'sliders-2', 'slim', 'smartphone-2', 'smile-2', 'snapchat', 'snowflake', 'solar-panel', 'sort-asc', 'sort-desc', 'soup', 'speaker-2', 'speech-bubble', 'sphere', 'spiral', 'spray-can', 'square-2', 'square-3', 'stacks', 'stadium', 'star-2', 'star-2-1', 'sticky-note', 'stop-circle', 'stopwatch', 'store', 'swords', 'syringe', 'table', 'tablet', 'tag-2', 'tags', 'tally', 'target-2', 'taxi', 'tear', 'telegram', 'temperature', 'template', 'tent', 'terminal-2', 'test-tube', 'text-2', 'text-align-center', 'text-align-justify', 'text-align-left', 'text-align-right', 'thermometer', 'thought-bubble', 'thumbs-down', 'ticket', 'timer-2', 'toilet', 'tools', 'tornado', 'totem', 'touchpad', 'tournament', 'tower', 'trace', 'traffic-cone', 'train', 'tram', 'trapezoid', 'trash-2', 'tree', 'tree-2', 'trello', 'trending-down', 'tremor', 'triangle-2', 'trophy', 'truck-2', 'tshirt', 'tube', 'tumble-dry', 'tv-2', 'twitch', 'twitter', 'type', 'umbrella-2', 'underline', 'undo', 'unlink', 'unlock', 'upload', 'usb', 'user-check', 'user-cog', 'user-crown', 'user-minus', 'user-plus', 'user-star', 'users', 'utensils', 'variable', 'vibrate', 'video-2', 'video-library', 'view', 'vinyl', 'virus', 'visual-studio', 'vkontakte', 'voicemail', 'volume-1', 'volume-x', 'vpn', 'wallet-2', 'wand', 'warehouse', 'watch-2', 'waves', 'webcam', 'wechat', 'weight', 'whatsapp', 'wheel', 'wifi-off', 'wifi-2', 'wind-2', 'windows', 'wine', 'wifi-1', 'wrench-2', 'x', 'xing', 'youtube-2', 'zap-2', 'zoom-in', 'zoom-out'],
  iconoir: ['globe', 'star', 'heart', 'lightning', 'book', 'briefcase', 'coffee', 'code', 'database', 'file-text', 'folder', 'home', 'image', 'link', 'map', 'message-circle', 'music', 'paperclip', 'play', 'search', 'settings', 'shopping-bag', 'sun', 'tag', 'terminal', 'tool', 'trending-up', 'truck', 'tv', 'umbrella', 'user', 'video', 'watch', 'wifi', 'mail', 'calendar', 'credit-card', 'gift', 'key', 'lock', 'package', 'phone', 'printer', 'share', 'shield', 'bell', 'bookmark', 'check-circle', 'clipboard', 'clock', 'cloud', 'edit', 'eye', 'file', 'flag', 'hash', 'headphones', 'inbox', 'layers', 'layout', 'list', 'mic', 'monitor', 'moon', 'mouse', 'move', 'music', 'navigation', 'pause', 'pie-chart', 'power', 'repeat', 'rewind', 'save', 'send', 'server', 'skip-back', 'skip-forward', 'slash', 'sliders', 'smartphone', 'speaker', 'square', 'stack', 'target', 'thumbs-up', 'timer', 'trash', 'triangle', 'upload', 'volume', 'wallet', 'wind', 'x-circle', 'youtube', 'activity', 'airplane', 'anchor', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'award', 'axe', 'baby', 'backpack', 'bandage', 'battery', 'bean', 'bed', 'bike', 'binary', 'birthday', 'blender', 'bomb', 'book-open', 'boots', 'box', 'boxing', 'brush', 'bucket', 'bug', 'building', 'bulb', 'bullseye', 'bus', 'cabin', 'cable', 'cactus', 'cake', 'calculator', 'camera', 'candy', 'car', 'carrot', 'castle', 'cat', 'charging', 'chat', 'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle', 'citrus', 'clapperboard', 'click', 'clipboard-check', 'cloud-lightning', 'cloud-rain', 'cloud-snow', 'clouds', 'club', 'code-bracket', 'color-picker', 'columns', 'compass', 'cone', 'context-menu', 'control', 'cookie', 'copy', 'copyright', 'cpu', 'crop', 'crosshair', 'cube', 'curly-braces', 'currency', 'cylinder', 'dance', 'dashboard', 'deer', 'delta', 'desk', 'diamond', 'dices', 'disc', 'divide', 'dna', 'dog', 'dollar', 'dollipop', 'door', 'download', 'drag', 'dribbble', 'droplet', 'drum', 'ear', 'eclipse', 'egg', 'elevator', 'emoji', 'equal', 'eraser', 'euro', 'expand', 'external-link', 'eye-off', 'feather', 'fingerprint', 'fish', 'flag-2', 'flame', 'flask', 'flip', 'flower', 'folder-2', 'folder-open', 'folders', 'footprints', 'fork', 'forward', 'frame', 'framer', 'frown', 'gamepad', 'gantt-chart', 'gem', 'ghost', 'git', 'glass', 'glasses', 'globe-2', 'goggles', 'golf', 'graduation-cap', 'grid', 'guitar', 'hammer', 'hand', 'hard-drive', 'haze', 'headset', 'heart-handshake', 'hearts', 'help-circle', 'hexagon', 'high-voltage', 'hiking', 'history', 'hockey', 'hospital', 'hot', 'hotel', 'hourglass', 'ice-cream', 'id-card', 'image-2', 'images', 'import', 'inbox', 'info', 'instagram', 'italic', 'japanese-yen', 'joystick', 'kayaking', 'keyboard', 'laptop', 'lasso', 'laugh', 'lawn-mower', 'leaf', 'library', 'life-buoy', 'lightbulb', 'linkedin', 'link-2', 'list', 'locate', 'location', 'lock-2', 'log-in', 'log-out', 'love', 'magnet', 'mail-2', 'mailbox', 'map-pin', 'marker', 'martini', 'maximize', 'medal', 'megaphone', 'meh', 'message', 'mic-2', 'minimize', 'minus', 'mist', 'mobile', 'mona-lisa', 'mountain', 'mouse-pointer', 'move-2', 'navigate', 'network', 'news', 'next', 'notebook', 'notepad', 'notification', 'npm', 'number', 'nutrition', 'octagon', 'option', 'orbit', 'package', 'padlock', 'page-break', 'paint-brush', 'palette', 'paperclip', 'parentheses', 'parking', 'party-popper', 'paste', 'paw-print', 'paypal', 'peace', 'pen-tool', 'percent', 'phone-call', 'phone-incoming', 'phone-off', 'phone-outgoing', 'pill', 'pin', 'pipette', 'plane', 'play-circle', 'playlist', 'plus', 'podcast', 'pointer', 'popup', 'presentation', 'previous', 'printer', 'projector', 'puzzle', 'question-mark', 'radar', 'radio', 'receipt', 'recycle', 'redo', 'refresh', 'repeat-2', 'report', 'ruler', 'running', 'sad', 'sailboat', 'save-2', 'scaling', 'scan', 'scatter', 'school', 'scissors', 'screen-share', 'scroll', 'search-2', 'security', 'selfie', 'send-2', 'server-2', 'settings-2', 'share-2', 'shield-2', 'shield-check', 'shield-off', 'ship', 'shirt', 'shopping-cart', 'shuffle', 'sidebar', 'signal', 'sign-in', 'sign-out', 'siren', 'skateboard', 'skew', 'slack', 'slash-2', 'sliders-2', 'small-caps', 'smartphone-2', 'smile', 'snapchat', 'snowflake', 'social-network', 'solar-panel', 'sort', 'soup', 'speaker-2', 'speech-bubble', 'sphere', 'spiral', 'spray', 'square-2', 'stacks', 'stadium', 'star-2', 'sticky-note', 'stop-circle', 'stopwatch', 'store', 'swords', 'syringe', 'table', 'tablet', 'tag-2', 'tags', 'target', 'taxi', 'telegram', 'temperature', 'template', 'tent', 'terminal-2', 'test-tube', 'text', 'thermometer', 'thought-bubble', 'thumbs-down', 'ticket', 'timer', 'toilet', 'tools', 'tornado', 'tower', 'trace', 'traffic-cone', 'train', 'tram', 'trapezoid', 'tree', 'trello', 'trending-down', 'trophy', 'truck', 'tshirt', 'tube', 'tumblr', 'twitch', 'twitter', 'type', 'underline', 'undo', 'unlink', 'unlock', 'upload', 'usb', 'user', 'user-2', 'utensils', 'vampire', 'variable', 'vibrate', 'video', 'view', 'vimeo', 'virus', 'visual-studio', 'vk', 'voicemail', 'volume-2', 'vpn', 'wallet', 'wand', 'warehouse', 'watch', 'waves', 'webcam', 'wechat', 'weight', 'whatsapp', 'wheel', 'wifi-off', 'windows', 'wine', 'wrench', 'x', 'xing', 'yahoo', 'yelp', 'youtube', 'zap'],
  phosphor: ['globe-star', 'star', 'heart', 'lightning', 'book', 'briefcase', 'coffee', 'code', 'cpu', 'database', 'file-text', 'folder', 'home', 'image', 'link', 'map', 'chats-circle', 'music-notes', 'paperclip', 'play', 'magnifying-glass', 'gear', 'shopping-bag', 'smiley', 'sun', 'tag', 'terminal', 'wrench', 'trend-up', 'truck', 'tv', 'umbrella', 'user', 'video-camera', 'watch', 'wifi-high', 'envelope', 'calendar', 'credit-card', 'gift', 'key', 'lock', 'package', 'phone', 'printer', 'share-network', 'shield-check', 'bell', 'bookmark-simple', 'calendar-check', 'check-circle', 'clipboard', 'clock', 'cloud', 'pencil', 'eye', 'file', 'flag', 'hash', 'headphones', 'inbox', 'layers', 'grid-four', 'list', 'microphone', 'monitor', 'moon', 'mouse', 'arrows-left-right', 'music-notes-simple', 'navigation-arrow', 'pause', 'chart-pie', 'power', 'repeat', 'rewind', 'floppy-disk', 'paper-plane-tilt', 'server', 'skip-back', 'skip-forward', 'sliders-horizontal', 'device-mobile', 'speaker-high', 'square', 'stack', 'target', 'thumbs-up', 'timer', 'trash', 'tree-structure', 'caret-up', 'upload', 'wallet', 'wind', 'x-circle', 'youtube-logo', 'activity', 'airplane', 'anchor', 'archive', 'arrow-bend-double-up', 'arrow-bend-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'arrows-in', 'arrows-out', 'award', 'axe', 'baby', 'backpack', 'bag', 'balloon', 'bandaids', 'bank', 'barbell', 'barcode', 'basket', 'bat', 'bath', 'battery-charging', 'battery-empty', 'battery-full', 'battery-warning', 'bean', 'bed', 'beer', 'bell-simple', 'bell-slash', 'bicycle', 'binary', 'bird', 'blender', 'bomb', 'bone', 'book-bookmark', 'book-open', 'bookmark', 'bookmarks', 'boots', 'bowl-food', 'box', 'boxing-glove', 'brackets-curly', 'brackets-round', 'brackets-square', 'brain', 'brandy', 'briefcase-metal', 'brightness', 'brightness-high', 'brightness-low', 'broom', 'brush', 'bucket', 'bug', 'building', 'bulldozer', 'bullet', 'bullseye', 'bus', 'cabin', 'cable', 'cactus', 'cake', 'calculator', 'calendar-blank', 'calendar-plus', 'calendar-x', 'camera', 'camera-slash', 'car', 'car-simple', 'card', 'cards', 'caret-down', 'caret-left', 'caret-right', 'carrot', 'castle', 'cat', 'cd', 'cell-signal', 'chair', 'chalkboard', 'chalkboard-teacher', 'chart-bar', 'chart-line-up', 'chart-pie-slice', 'chat-centered', 'chat-centered-dots', 'chat-dots', 'chat-text', 'chats', 'check-square', 'check-square-offset', 'chrome', 'church', 'circle-dashed', 'circle-half', 'circle-wavy', 'circles-three', 'circles-four', 'clipboard-text', 'clipboard-check', 'cloud-arrow-down', 'cloud-arrow-up', 'cloud-check', 'cloud-warning', 'cloud-x', 'clouds', 'club', 'code', 'code-simple', 'codepen', 'codesandbox', 'coffeecup', 'coin', 'coins', 'columns', 'command', 'compass', 'compass-tool', 'copy', 'copy-simple', 'corners', 'couch', 'cpu', 'crack', 'crane', 'creative-commons', 'credit-card', 'crop', 'cross', 'crosshair', 'crowd', 'crown', 'cube', 'cup-hot', 'cup-soda', 'curly-braces', 'cylinder', 'diamonds', 'diamond-stone', 'dice', 'disc', 'disk', 'divide', 'dna', 'dog', 'door', 'door-open', 'dot', 'dots-nine', 'dots-six', 'dots-six-vertical', 'dots-three', 'dots-three-outline', 'download', 'download-simple', 'drag', 'drone', 'drop', 'drop-half', 'drop-half-bottom', 'dropbox', 'droplet', 'droplets', 'drum', 'ear', 'ear-hearing', 'ease-in', 'ease-in-out', 'ease-out', 'egg', 'eject', 'elevator', 'envelope-simple', 'equalizer', 'eraser', 'escalator', 'eye-closed', 'eye-slash', 'eyedropper', 'eyeglasses', 'face-mask', 'facebook-logo', 'factory', 'fan', 'fast-forward', 'fast-forward-circle', 'feather', 'ferry', 'file', 'file-archive', 'file-audio', 'file-css', 'file-csv', 'file-doc', 'file-html', 'file-image', 'file-jpg', 'file-js', 'file-jsx', 'file-pdf', 'file-plus', 'file-png', 'file-py', 'file-sql', 'file-svg', 'file-text', 'file-ts', 'file-tsx', 'file-video', 'file-vue', 'file-xls', 'file-zip', 'film', 'film-slate', 'fingerprint', 'fire', 'fire-extinguisher', 'fish', 'fish-simple', 'flag', 'flag-banner', 'flashlight', 'flask', 'flip-horizontal', 'flip-vertical', 'flower', 'flower-lotus', 'folder', 'folder-lock', 'folder-minus', 'folder-notch', 'folder-open', 'folder-plus', 'folder-star', 'folders', 'footprints', 'fork', 'fork-knife', 'frame-corners', 'framer-logo', 'funnel', 'funnel-simple', 'game-controller', 'garage', 'gas-pump', 'gavel', 'gem', 'gender-female', 'gender-intersex', 'gender-male', 'gender-neuter', 'gender-transgender', 'ghost', 'gift', 'git-branch', 'git-commit', 'git-diff', 'git-fork', 'git-merge', 'git-pull-request', 'gitlab-logo', 'globe-hemisphere-east', 'globe-hemisphere-west', 'globe-simple', 'goggles', 'gold', 'golf', 'google-logo', 'google-photos', 'google-play', 'graduation-cap', 'graph', 'grid-nine', 'grid-three', 'grip-horizontal', 'grip-vertical', 'guitar', 'hamburger', 'hammer', 'hand-eye', 'hand-first', 'hand-fist', 'hand-grabbing', 'hand-palm', 'hand-peace', 'hand-pointing', 'hand-waving', 'hands-clapping', 'hands-pray', 'handshake', 'hard-drive', 'hash', 'hdd', 'headlights', 'headphones', 'heart-break', 'heart-straight', 'heartbeat', 'hearts', 'hexagon', 'high-quality', 'high-heel', 'hiking', 'hoodie', 'horse', 'hospital', 'hot-air-balloon', 'hotdog', 'hotel', 'hourglass', 'house', 'house-line', 'house-simple', 'ice-cream', 'infinite', 'info', 'instagram-logo', 'intersect', 'intersect-square', 'intersect-three', 'jar', 'jeep', 'kettlebell', 'key', 'key-return', 'keyboard', 'keyhole', 'knife', 'laptop', 'lasso', 'laundry', 'layer', 'leaf', 'ledgers', 'level', 'lifebuoy', 'lightbulb', 'lighthouse', 'lightning', 'lightning-slash', 'line-segment', 'line-segments', 'link', 'link-break', 'link-unbroken', 'linkedin-logo', 'linux', 'list', 'list-bullets', 'list-dashes', 'list-magnifying-glass', 'list-numbers', 'list-plus', 'loader', 'lock', 'lock-key', 'lock-key-open', 'lock-locked', 'lock-open', 'log-in', 'log-out', 'login', 'logout', 'lollipop', 'luggage', 'lyre', 'magnet-straight', 'magnet-two', 'man-head', 'map-front', 'map-pin', 'map-pin-line', 'map-trifold', 'marker-circle', 'mask', 'mastodon', 'math', 'maximize', 'medal', 'medal-military', 'medium-logo', 'megaphone', 'megaphone-simple', 'memo', 'memory', 'messenger-logo', 'meta-logo', 'microphone', 'microphone-slash', 'microscope', 'milk', 'minimize', 'minus', 'mint', 'mitochondria', 'mobile', 'mobile-notch', 'money', 'money-wavy', 'monitor', 'monitor-play', 'moon', 'moon-stars', 'more', 'more-horizontal', 'more-vertical', 'mosque', 'mountain', 'mouse', 'mouse-left', 'mouse-right', 'move', 'music-notes-plus', 'music-notes-slash', 'music-notes-square', 'music-speaker', 'navicon', 'navigation-arrow', 'needle', 'network', 'network-slash', 'newspaper', 'next', 'ninja', 'node', 'number-circle-one', 'number-circle-two', 'number-square-zero', 'number-square-one', 'number-square-two', 'nut', 'nutritionix', 'octagon', 'ok', 'onigiri', 'open-book', 'open-folder', 'option', 'orange', 'package', 'paint-brush', 'paint-brush-broad', 'paint-bucket', 'paint-roller', 'palette', 'paper-plane', 'paper-plane-tilt', 'paperclip', 'park', 'parlock', 'password', 'path', 'pause', 'paw-print', 'peace', 'pen', 'pen-nib', 'pencil', 'pencil-slash', 'percent', 'person', 'person-arms-spread', 'person-simple', 'phone', 'phone-call', 'phone-disconnect', 'phone-incoming', 'phone-outgoing', 'phone-slash', 'phone-transfer', 'photo', 'piano-keys', 'pizza', 'placeholder', 'plane', 'plane-tilt', 'play-circle', 'play-pause', 'playlist', 'plug', 'plugs-connected', 'plugs-disconnected', 'podcast', 'pointer', 'popcorn', 'popsicle', 'post', 'potted-plant', 'power', 'prescription', 'presentation', 'previous', 'print', 'printer', 'prints', 'projector-screen', 'projector-screen-chart', 'pulse', 'pump', 'push-pin', 'puzzle-piece', 'qr-code', 'question', 'queue', 'quotes', 'rabbit', 'radar', 'radio', 'radio-button', 'rainbow', 'rain-cloud', 'rar', 'razor', 'receipt', 'record', 'rectangle', 'rectangle-landscape', 'rectangle-portrait', 'recycle', 'reddit-logo', 'redo', 'refresh', 'repeat', 'repeat-once', 'return', 'rewind', 'rhombus', 'rocket', 'rocket-launch', 'roller', 'rotate-ccw', 'rotate-cw', 'router', 'rss', 'ruler', 'ruler-horizontal', 'ruler-protractor', 'run', 'sack', 'sailboat', 'scales', 'scan', 'scissors', 'scooter', 'screwdriver', 'scrubber', 'search', 'search-minus', 'search-plus', 'seat', 'selection', 'selection-all', 'selection-inverse', 'selection-plus', 'selection-slash', 'send', 'send-backward', 'send-forward', 'serial', 'server', 'server-rack', 'servers', 'service', 'settings', 'shapes', 'share', 'share-network', 'shield', 'shield-check', 'shield-checkered', 'shield-slash', 'shirt', 'shooting-star', 'shopping-bag', 'shopping-cart', 'shorts', 'shovel', 'shower', 'shuffle', 'sidebar', 'sigma', 'sign-in', 'sign-out', 'signpost', 'sim-card', 'siren', 'skateboard', 'skull', 'slash', 'sliders', 'sliders-horizontal', 'slinks', 'smile', 'smile-neutral', 'smoke', 'snapchat-logo', 'soccer-ball', 'socks', 'soft-drink', 'solar-panel', 'solar-power', 'sort-ascending', 'sort-descending', 'soundcloud-logo', 'source-code', 'spade', 'sparkle', 'speaker-hifi', 'speaker-high-voll', 'speaker-low', 'speaker-none', 'speaker-plus', 'speaker-x', 'speech', 'speedometer', 'spinner', 'spiral', 'spotify-logo', 'square', 'square-half', 'squares', 'stack', 'stack-logo', 'stamp', 'star', 'star-and-crescent', 'star-four-points', 'star-half', 'star-of-david', 'steps', 'stethoscope', 'sticker', 'stool', 'stop', 'stop-circle', 'storefront', 'strawberry', 'student', 'suitcase', 'suitcase-simple', 'sun', 'sun-dim', 'sun-horizon', 'sunglasses', 'sunrise', 'sunset', 'swimming', 'swipe', 'swipe-down', 'swipe-left', 'swipe-right', 'swipe-up', 'switch', 'switch-horizontal', 'switch-vertical', 'sword', 'swords', 'syringe', 't-shirt', 'table', 'tabs', 'tag', 'tag-chevron', 'tags', 'target', 'taxi', 'telegram-logo', 'television', 'television-simple', 'temperature', 'temperature-hot', 'temperature-cold', 'tennis', 'tent', 'terminal', 'terminal-window', 'test-tube', 'text-aa', 'text-aa-abc', 'text-b', 'text-columns', 'text-field', 'text-font-size', 'text-h', 'text-heading', 'text-indent', 'text-italic', 'text-kap', 'text-outdent', 'text-t', 'text-underline', 'text-uppercase', 'thermometer', 'thermometer-hot', 'thermometer-cold', 'thinking', 'thunder', 'thunderstorm', 'tickets', 'tidal-logo', 'tiktok-logo', 'timer', 'timer-slash', 'toilet', 'tornado', 'tower', 'tractor', 'traffic-cone', 'traffic-sign', 'train', 'train-simple', 'trash', 'trash-simple', 'tray', 'tree', 'tree-evergreen', 'tree-pine', 'trello-logo', 'trend-down', 'trend-up', 'triangle', 'trident', 'trophy', 'trowel', 'truck', 'truck-trailer', 'tumblr-logo', 'twitch-logo', 'twitter-logo', 'type', 'umbrella', 'umbrella-simple', 'university', 'unlock', 'upload', 'upload-simple', 'usb', 'user', 'user-circle', 'user-gear', 'user-minus', 'user-plus', 'user-rectangle', 'user-switch', 'users', 'users-four', 'users-three', 'varnish', 'vase', 'vending-machine', 'vessel', 'video', 'video-camera', 'video-camera-slash', 'view', 'viewfinder', 'vine', 'vk-logo', 'voicemail', 'volleyball', 'volume', 'volume-high', 'volume-low', 'volume-slash', 'volume-x', 'vpn', 'vrello', 'wallet', 'wand', 'warehouse', 'warning', 'warning-circle', 'warning-octagon', 'wavy', 'webcam', 'webcam-slash', 'webhooks', 'wechat-logo', 'whatsapp-logo', 'wheelchair', 'wheelchair-motion', 'whistle', 'wifi', 'wifi-high', 'wifi-low', 'wifi-none', 'wifi-slash', 'wind', 'window', 'windows-logo', 'wine', 'wrench', 'x', 'x-circle', 'x-square', 'xing-logo', 'youtube-logo', 'zap', 'zipped', 'zoom-in', 'zoom-out'],
  heroicons: ['globe-alt', 'star', 'heart', 'bolt', 'book-open', 'briefcase', 'coffee', 'code-bracket', 'cpu-chip', 'circle-stack', 'document-text', 'folder', 'home', 'photo', 'link', 'map', 'chat-bubble-left-right', 'musical-note', 'paper-clip', 'play', 'magnifying-glass', 'cog', 'shopping-bag', 'face-smile', 'sun', 'tag', 'command-line', 'wrench', 'arrow-trending-up', 'truck', 'tv', 'umbrella', 'user', 'video-camera', 'clock', 'wifi', 'envelope', 'calendar', 'credit-card', 'gift', 'key', 'lock-closed', 'cube', 'phone', 'printer', 'share', 'shield-check', 'bell', 'bookmark', 'calendar-check', 'check-circle', 'clipboard', 'cloud', 'pencil', 'eye', 'document', 'flag', 'number', 'headphones', 'inbox', 'layers', 'square-3-stack-3d', 'list-bullet', 'microphone', 'computer-desktop', 'moon', 'computer-mouse', 'arrows-right-left', 'musical-note', 'compass', 'pause', 'chart-pie', 'power', 'arrow-path', 'backward', 'floppy-disk', 'paper-airplane', 'server', 'backward', 'forward', 'bars-3', 'device-phone-mobile', 'speaker-wave', 'square', 'stack', 'cursor-arrow-rays', 'hand-thumbs-up', 'timer', 'trash', 'chevron-up', 'arrow-up-tray', 'speaker-wave', 'wallet', 'wind', 'x-circle', 'youtube', 'academic-cap', 'adjustments-horizontal', 'adjustments-vertical', 'archive-box', 'archive-box-x-mark', 'arrow-down-circle', 'arrow-down-left', 'arrow-down-right', 'arrow-down-tray', 'arrow-left-circle', 'arrow-left-end', 'arrow-left-start', 'arrow-left-tray', 'arrow-path', 'arrow-right-circle', 'arrow-right-end', 'arrow-right-start', 'arrow-right-tray', 'arrow-up-circle', 'arrow-up-left', 'arrow-up-right', 'arrow-up-tray', 'arrows-pointing-out', 'arrows-up-down', 'arrows-up-down-left', 'arrows-up-down-right', 'at-symbol', 'beaker', 'bell-alert', 'bell-slash', 'bell-snooze', 'book-open-variant', 'bookmark-alt', 'bookmark-slash', 'briefcase-arrow-up-right', 'bug-ant', 'building-library', 'building-office-2', 'building-office', 'building-storefront', 'cake', 'calculator', 'calendar-days', 'calendar-range', 'camera', 'chart-bar-square', 'chart-bar', 'chart-pie', 'chat-bubble-bottom-center', 'chat-bubble-bottom-left', 'chat-bubble-left', 'chat-bubble-left-ellipsis', 'chat-bubble-left-right', 'chat-bubble-oval-left', 'chat-bubble-oval-left-ellipsis', 'chatBubbleOvalLeftEllipsis', 'checkmark', 'checkmark-circle', 'chevron-double-down', 'chevron-double-left', 'chevron-double-right', 'chevron-double-up', 'chip', 'circle', 'clipboard-check', 'clipboard-document', 'clipboard-document-check', 'clipboard-list', 'clock-arrow-2-circlepath', 'cloud-arrow-down', 'cloud-arrow-up', 'cloud-check', 'cloud-download', 'cloud-exclamation', 'cloud-question', 'cloud-upload', 'code-bracket-square', 'code-bracket', 'cog-6-tooth', 'color-swatch', 'comment', 'comments', 'computer-desktop', 'cpu-chip', 'credit-card', 'currency-bangladeshi', 'currency-dollar', 'currency-euro', 'currency-pound', 'currency-rupee', 'currency-yen', 'cursor-arrow-rl', 'cursor-arrow-rays', 'device-tablet', 'device-tv', 'diamond', 'document', 'document-magnifying-glass', 'document-plus', 'document-arrow-down', 'document-arrow-up', 'document-check', 'document-duplicate', 'document-minus', 'document-plus', 'document-text', 'document-arrow-right', 'ellipsis-horizontal-circle', 'ellipsis-horizontal', 'ellipsis-vertical', 'envelope-open', 'envelope', 'envelope-simple', 'exclamation-circle', 'exclamation-triangle', 'eye-dropper', 'face-frown', 'face-meh', 'face-smile', 'face-smile-upsdown', 'film', 'folder-arrow-down', 'folder-plus', 'folder', 'folder-open', 'funnel', 'funnel-simple', 'fust', 'gear', 'gift-top', 'globe-alt', 'globe-americas', 'globe-asia-australia', 'globe-europe-africa', 'globe', 'golf', 'hashtag', 'heart', 'home-modern', 'home', 'home-mini', 'identification', 'information-circle', 'key', 'language', 'laptop', 'layout-grid', 'layout-list', 'lifebuoy', 'light-bulb', 'link', 'link-2', 'list-bullet', 'list-bullet-rectangle', 'list-checks', 'location-marker', 'lock-closed', 'lock-open', 'magic-wand', 'magnet', 'magnifying-glass', 'magnifying-glass-circle', 'magnifying-glass-minus', 'magnifying-glass-plus', 'map', 'map-pin', 'megaphone', 'menu-1', 'menu-2', 'menu-3', 'menu-alt-1', 'menu-alt-2', 'menu-alt-3', 'menu-alt-4', 'microphone', 'mini-player', 'minus', 'minus-circle', 'minus-square', 'mobile', 'moon', 'mountain', 'musical-note', 'nav-arrow-in', 'nav-arrow-out', 'news-paper', 'no-symbol', 'paint-brush', 'paint-brush-1', 'paper-airplane', 'paper-clip', 'paper-plane', 'pause', 'pause-circle', 'pencil', 'pencil-square', 'pencil-square-s', 'phone', 'phone-arrow-down-left', 'phone-arrow-up-right', 'phone-xmark', 'photo', 'photo-collection', 'piano', 'pill', 'play', 'play-circle', 'plus', 'plus-circle', 'plus-square', 'presentation-chart-bar', 'presentation-chart-line', 'presentation-chart-pie', 'printer', 'puzzle-piece', 'qr-code', 'question-mark-circle', 'queue-list', 'radio', 'rectangle-group', 'rectangle-stack', 'rectangle-stack-plus', 'repeat', 'reuse', 'rocket-launch', 'rss', 'ruler', 'save', 'scale', 'scissors', 'screencast', 'screwdriver', 'search-circle', 'search', 'server', 'server-stack', 'share', 'share-square', 'shield', 'shield-check', 'shield-exclamation', 'shopping-bag', 'shopping-cart', 'shuffle', 'sidebar-left', 'signal', 'sign-in', 'sign-out', 'signal-slash', 'sparkles', 'speakerphone', 'star', 'stop', 'stop-circle', 'strawberry', 'sun', 'swatch', 'swatch-2', 'switch-horizontal', 'switch-vertical', 'table-cells', 'table-cells', 'tag', 'talk', 'target', 'template', 'terminal', 'thumb-down', 'thumb-up', 'ticket', 'trash', 'trophy', 'truck', 'tv', 'underline', 'user-add', 'user-circle', 'user-group', 'user-minus', 'user-plus', 'user-remove', 'user', 'users', 'users-add', 'variable', 'video-camera', 'video-camera-slash', 'view-columns', 'view-grid', 'view-grid-add', 'view-list', 'voice', 'volume-up', 'wallet', 'watch', 'wifi', 'window', 'wrench', 'wrench-screwdriver', 'x-circle', 'x-mark'],
};

function TagIconLibrarySelector({ prefix, iconSet, onSelect, currentIcon, searchQuery }: { prefix: string; iconSet: string; onSelect: (icon: string) => void; currentIcon: string; searchQuery: string }) {
  const icons = tagIconLibraryIcons[iconSet] || [];
  const filteredIcons = searchQuery.trim() 
    ? icons.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : icons.slice(0, 60);

  const [brokenIcons, setBrokenIcons] = useState<Set<string>>(new Set());

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-8 gap-1">
        {filteredIcons.map((iconName) => (
          <button
            key={iconName}
            onClick={() => onSelect(`${prefix}:${iconName}`)}
            className={`p-1.5 flex items-center justify-center rounded border ${currentIcon === `${prefix}:${iconName}` ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            title={iconName}
          >
            {brokenIcons.has(iconName) ? (
              <span className="w-4 h-4 text-gray-300 text-xs">?</span>
            ) : (
              <img
                src={`https://api.iconify.design/${prefix}/${iconName}.svg?width=16&height=16`}
                alt={iconName}
                className="w-4 h-4"
                onError={() => setBrokenIcons(prev => new Set(prev).add(iconName))}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function renderIconPreview(icon: string) {
  if (!icon) return <Globe size={20} className="text-gray-400" />;
  
  if (icon.startsWith('http') || icon.startsWith('data:image')) {
    return <img src={icon} alt="preview" className="w-5 h-5" />;
  }
  if (icon.startsWith('<svg')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} className="w-5 h-5" />;
  }
  if (icon.startsWith('dicebear:')) {
    const parts = icon.split(':');
    const style = parts[1] || 'avataaars';
    const seed = parts[2] || 'seed1';
    return <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt="preview" className="w-5 h-5" />;
  }
  if (icon.startsWith('avataaars:')) {
    const parts = icon.split(':');
    return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`} alt="preview" className="w-5 h-5" />;
  }
  if (icon.includes(':')) {
    const [prefix, name] = icon.split(':');
    return <img src={`https://api.iconify.design/${prefix}/${name}.svg?width=20&height=20`} alt="preview" className="w-5 h-5" />;
  }
  const IconComp = (Icons as any)[icon];
  return IconComp ? <IconComp size={18} /> : <Globe size={20} className="text-gray-400" />;
}

export function TagModal() {
  const { editingTag, setEditingTag, tags, setTags, categories, settings, addingTag, closeAddTag } = useStore();
  const isAdding = !!addingTag;
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [urlExternal, setUrlExternal] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [showUrlExternal, setShowUrlExternal] = useState(false);
  const [iconTab, setIconTab] = useState('iconify');
  const [iconSearch, setIconSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [iconColor, setIconColor] = useState('#6b7280');
  const [textColor, setTextColor] = useState('#374151');

  useEffect(() => {
    if (editingTag) {
      setTitle(editingTag.title || '');
      setUrl(editingTag.url || '');
      setUrlExternal(editingTag.url_external || '');
      setDescription(editingTag.description || '');
      setIconUrl(editingTag.icon_url || '');
      setShowDescription(editingTag.show_description || false);
      setShowUrl(editingTag.show_url || false);
      setShowUrlExternal(editingTag.show_url_external || false);
      setCategoryId(editingTag.category_id || '');
      setIconColor(editingTag.icon_color || '#6b7280');
      setTextColor(editingTag.text_color || '#374151');
      if (editingTag.icon_url) {
        if (editingTag.icon_url.includes(':')) setIconTab('iconify');
        else if (editingTag.icon_url.startsWith('http') || editingTag.icon_url.startsWith('data:')) setIconTab('url');
        else setIconTab('lucide');
      }
    } else if (addingTag) {
      setTitle('');
      setUrl('');
      setUrlExternal('');
      setDescription('');
      setIconUrl('');
      setShowDescription(false);
      setShowUrl(false);
      setShowUrlExternal(false);
      setIconTab('iconify');
      setCategoryId(addingTag.categoryId);
      setIconColor('#6b7280');
      setTextColor('#374151');
    }
  }, [editingTag, addingTag]);

const onSave = async () => {
    if (!title.trim()) return;
    if (!categoryId) return;
    
    if (isAdding) {
      const id = 'tag_' + Date.now();
      const newTag = {
        id,
        category_id: categoryId,
        title: title.trim(),
        url: url || '',
        url_external: urlExternal || '',
        description: description || '',
        icon_url: iconUrl || '',
        icon_color: iconColor,
        text_color: textColor,
        position_order: 0,
        show_description: showDescription,
        show_url: showUrl,
        show_url_external: showUrlExternal
      };
      setTags([...tags, newTag]);
      closeAddTag();
      try {
        await api.post('/api/tags', newTag);
      } catch(err) {
        console.error("Failed to add tag");
      }
    } else if (editingTag) {
      const updatedTag = { 
        ...editingTag, 
        category_id: categoryId,
        title, 
        url, 
        url_external: urlExternal,
        description, 
        icon_url: iconUrl,
        icon_color: iconColor,
        text_color: textColor,
        show_description: showDescription,
        show_url: showUrl,
        show_url_external: showUrlExternal 
      };
      const newTags = tags.map(t => t.id === editingTag.id ? updatedTag : t);
      setTags(newTags);
      setEditingTag(null);
      try {
        await api.put(`/api/tags/${editingTag.id}`, updatedTag);
      } catch(err) {
        console.error("Failed to save tag");
      }
    }
  };

  const onDelete = async () => {
    if (!editingTag) return;
    if (!confirm('确定要删除这个标签吗？')) return;
    const newTags = tags.filter(t => t.id !== editingTag.id);
    setTags(newTags);
    setEditingTag(null);
    try {
       await api.delete(`/api/tags/${editingTag.id}`);
    } catch(err) {
       console.error("Failed to delete tag");
    }
  };

  const selectedCategory = categories.find(c => c.id === (editingTag?.category_id || addingTag?.categoryId));

  const handleClose = () => {
    if (isAdding) {
      closeAddTag();
    } else {
      setEditingTag(null);
    }
  };

  return (
    <Dialog.Root open={!!editingTag || !!addingTag} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-lg z-50 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              {isAdding ? '添加标签' : '编辑标签'} {selectedCategory ? `- ${selectedCategory.name}` : ''}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 outline-none"><X size={18} /></button>
            </Dialog.Close>
          </div>
          
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">名称</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">分类</label>
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">选择分类</option>
                {categories.filter(c => c.id !== 'root').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">内网URL</label>
              <input 
                type="text" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                placeholder="https://"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input 
                  type="checkbox" 
                  checked={showUrl} 
                  onChange={e => setShowUrl(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">外网URL</label>
              <input 
                type="text" 
                value={urlExternal} 
                onChange={e => setUrlExternal(e.target.value)} 
                placeholder="https://"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input 
                  type="checkbox" 
                  checked={showUrlExternal} 
                  onChange={e => setShowUrlExternal(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">描述</label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input 
                  type="checkbox" 
                  checked={showDescription} 
                  onChange={e => setShowDescription(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                图标
                {iconUrl && (
                  <span className="ml-2 font-normal text-gray-500">
                    (预览: <span className="inline-flex items-center">{renderIconPreview(iconUrl)}</span>)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="搜索图标..."
                className="w-full px-3 py-1.5 mb-2 border border-gray-300 rounded text-sm focus:outline-none"
              />
              <Tabs.Root value={iconTab} onValueChange={setIconTab} className="border border-gray-200 rounded text-xs">
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                  <Tabs.Trigger value="iconify" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Iconify
                  </Tabs.Trigger>
                  <Tabs.Trigger value="lucide" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Lucide
                  </Tabs.Trigger>
                  <Tabs.Trigger value="iconoir" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Iconoir
                  </Tabs.Trigger>
                  <Tabs.Trigger value="phosphor" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Phosphor
                  </Tabs.Trigger>
                  <Tabs.Trigger value="heroicons" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Heroicons
                  </Tabs.Trigger>
                  <Tabs.Trigger value="url" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    图片
                  </Tabs.Trigger>
                </Tabs.List>
                
                <div className="p-2">
                  <Tabs.Content value="iconify">
                    <IconifySearch onSelect={setIconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>
                  
                  <Tabs.Content value="lucide">
                    <TagIconLibrarySelector prefix="lucide" iconSet="lucide" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="iconoir">
                    <TagIconLibrarySelector prefix="iconoir" iconSet="iconoir" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="phosphor">
                    <TagIconLibrarySelector prefix="phosphor" iconSet="phosphor" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="heroicons">
                    <TagIconLibrarySelector prefix="heroicons" iconSet="heroicons" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="url">
                    <input 
                      type="text" 
                      value={iconUrl} 
                      onChange={e => setIconUrl(e.target.value)} 
                      placeholder="https://example.com/icon.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none" 
                    />
                    {iconUrl && (
                      <div className="mt-2 flex items-center justify-center p-2 border border-gray-200 rounded bg-gray-50">
                        <img src={iconUrl} alt="preview" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </Tabs.Content>
                </div>
              </Tabs.Root>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">图标颜色</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={iconColor} onChange={e => setIconColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                    <input type="text" value={iconColor} onChange={e => setIconColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">文字颜色</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                    <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-between bg-gray-50 shrink-0">
            {!isAdding && (
              <button onClick={onDelete} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                <Trash2 size={14} />删除
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">取消</button>
              </Dialog.Close>
              <button onClick={onSave} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm">{isAdding ? '添加' : '保存'}</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}