class GCalendarRegister {
  set({scheduleTitle, date}) {
    console.log(`Registered: ${date}, ${scheduleTitle}`);
  }
}

export default new GCalendarRegister();
