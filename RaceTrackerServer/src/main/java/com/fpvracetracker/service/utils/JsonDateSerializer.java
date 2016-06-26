// package com.fpvracetracker.service.utils;
//
// import java.io.IOException;
// import java.text.SimpleDateFormat;
// import java.util.Date;
// import org.codehaus.jackson.JsonGenerator;
// import org.codehaus.jackson.JsonProcessingException;
// import org.codehaus.jackson.map.JsonSerializer;
// import org.codehaus.jackson.map.SerializerProvider;
// import org.springframework.stereotype.Component;
//
// @Component
// public class JsonDateSerializer extends JsonSerializer<Date> {
// // 2015-09-26T17:06:59.973Z
// private static final SimpleDateFormat dateFormat = new
// SimpleDateFormat("yyyy-MM-dd HH:mm a z");
//
// @Override
// public void serialize(Date date, JsonGenerator gen, SerializerProvider
// provider)
// throws IOException, JsonProcessingException {
// String formattedDate = dateFormat.format(date);
// gen.writeString(formattedDate);
// }
// }