/**
 * Convert ICS (iCalendar) file content to JSON format
 * @param {string} icsContent - The raw ICS file content
 * @returns {array} Array of event objects
 */
export function parseICSFile(icsContent) {
  const events = [];
  
  // Split by VEVENT blocks
  const eventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let match;

  while ((match = eventRegex.exec(icsContent)) !== null) {
    const eventContent = match[1];
    const event = {};

    // Parse each property
    const lines = eventContent.split('\n');
    let currentProperty = '';
    let currentValue = '';

    for (let line of lines) {
      line = line.trim();

      if (!line) continue;

      // Handle multi-line properties (unfold)
      if (line.match(/^[ \t]/) && currentProperty) {
        currentValue += line.substring(1);
      } else {
        if (currentProperty) {
          // Process previous property
          parseProperty(event, currentProperty, currentValue);
        }

        // Start new property
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
          currentProperty = line.substring(0, colonIndex);
          currentValue = line.substring(colonIndex + 1);
        }
      }
    }

    // Process last property
    if (currentProperty) {
      parseProperty(event, currentProperty, currentValue);
    }

    // Only add events with required fields
    if (event.title && event.start && event.end) {
      events.push(event);
    }
  }

  return events;
}

/**
 * Parse a single ICS property
 */
function parseProperty(event, property, value) {
  const prop = property.toUpperCase();

  switch (prop) {
    case 'SUMMARY':
      event.title = decodeURIComponent(value).replace(/\\n/g, ' ');
      break;
    case 'DTSTART':
      event.start = formatICSDate(value);
      break;
    case 'DTEND':
      event.end = formatICSDate(value);
      break;
    case 'DESCRIPTION':
      event.description = decodeURIComponent(value).replace(/\\n/g, ' ');
      break;
    case 'LOCATION':
      event.location = decodeURIComponent(value);
      break;
  }
}

/**
 * Convert ICS date format to ISO 8601
 * Formats: YYYYMMDD, YYYYMMDDTHHMMSS, YYYYMMDDTHHMMSSZ
 */
function formatICSDate(dateStr) {
  dateStr = dateStr.trim();

  // Remove TZID parameter if present (e.g., TZID=America/New_York:20260207T100000)
  if (dateStr.includes(':')) {
    dateStr = dateStr.split(':')[1];
  }

  // Handle all-day events (8 characters: YYYYMMDD)
  if (dateStr.length === 8 && !dateStr.includes('T')) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}T00:00`;
  }

  // Handle datetime (14+ characters: YYYYMMDDTHHmmss)
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(9, 11) || '00';
  const min = dateStr.substring(11, 13) || '00';

  return `${year}-${month}-${day}T${hour}:${min}`;
}

/**
 * Convert JSON array to ICS file content
 */
export function jsonToICS(events, calendarName = 'Wellness Schedule') {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CalmHer//Wellness Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calendarName}
X-WR-TIMEZONE:UTC
BEGIN:VTIMEZONE
TZID:UTC
BEGIN:STANDARD
DTSTART:19700101T000000Z
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
TZNAME:UTC
END:STANDARD
END:VTIMEZONE
`;

  events.forEach((event, index) => {
    const startDate = event.start.replace(/[-:]/g, '').replace('T', 'T');
    const endDate = event.end.replace(/[-:]/g, '').replace('T', 'T');
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    icsContent += `BEGIN:VEVENT
UID:wellness-${index}-${Date.now()}@calmher.app
DTSTAMP:${timestamp}
DTSTART:${startDate}Z
DTEND:${endDate}Z
SUMMARY:${event.title}
DESCRIPTION:${event.notes || event.description || ''}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  icsContent += 'END:VCALENDAR';
  return icsContent;
}
