type Time = string | Date;

export function getDays(time?: Time): number{
  if (time) {
    time = time instanceof Date ? time : new Date(time);
  } else {
    time = new Date();
  }
  time.setMonth(time.getMonth() + 1);
  time.setDate(0);

  return time.getDate();
}