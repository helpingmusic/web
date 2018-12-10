import { Doc } from './doc';

export class Bookable extends Doc {
  id: string;
  name: string;
  location: string;
  timezone: string;
  description: string;
  rates: {
    [tier: string]: number;
  };
  hours: {
    [tier: string]: {
      [day: string]: Array<{start: number, end: number}>;
    }
  };
  calendars: Array<string>;
  calendarUrl: string;
  imageUrl: string;

  constructor(body?: object) {
    super();
    Object.assign(this, body);

    this.setCalUrl();
  }

  setCalUrl() {
    const gcalUrl = 'https://calendar.google.com/calendar/embed';

    const colors = [
      '#2952A3',
      '#28754E',
      '#A32929',
    ];

    const query = this.calendars.map((cal, i) => {
      const params = {
        src: cal,
        title: this.name,
        showPrint: 0,
        showCalendars: 0,
        mode: 'WEEK',
        height: 600,
        width: 800,
        wkst: 1,
        bgcolor: '#FFFFFF',
        color: colors[i],
        ctz: this.timezone,
      };

      return Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
    })
      .join('&');

    this.calendarUrl = gcalUrl + '?' + query;
  }

}
