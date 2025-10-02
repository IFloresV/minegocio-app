const Dates = {
   DateStart: () => {
      const currentDate = new Date(); // Fecha actual
      currentDate.setDate(currentDate.getDate() - 30); // Restar 30 días
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const value = `${year}-${month}-${day}`;

      return value;
   },
   DateEnd: () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const value = `${year}-${month}-${day}`;

      return value;
   },
};

export default Dates;
