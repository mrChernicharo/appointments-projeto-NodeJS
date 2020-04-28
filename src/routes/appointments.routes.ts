import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/appointmentsRepository';

const appointmentsRouter = Router();

const appointments = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointmentsList = appointments.all();

  return response.json(appointmentsList);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointments.findByDate(parsedDate);

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointments.create(provider, parsedDate);

  return response.json(appointment);
});

export default appointmentsRouter;
