package com.fpvracetracker.rest;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.buffer.impl.BufferFactoryImpl;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.HttpClientResponse;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpvracetracker.dao.DBTestDao;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.User;
import com.fpvracetracker.model.onlineEvent.OnlineEventResponse;
import com.fpvracetracker.model.onlineRegistration.OnlineRegistration;
import com.fpvracetracker.model.onlineResult.OnlineResultResponse;
import com.fpvracetracker.model.request.BaseSyncRequest;
import com.fpvracetracker.model.request.ClassSyncRequest;
import com.fpvracetracker.model.request.CompetitionSyncRequest;
import com.fpvracetracker.model.request.PilotSyncRequest;
import com.fpvracetracker.model.request.RaceBandSyncRequest;
import com.fpvracetracker.model.request.RaceSyncRequest;
import com.fpvracetracker.model.response.StatusResponse;
import com.fpvracetracker.model.response.StatusResponseTypes;
import com.fpvracetracker.model.response.TransferResponse;
import com.fpvracetracker.model.sync.SyncTypes;
import com.fpvracetracker.service.OnlineEventService;
import com.fpvracetracker.service.OnlineRegistrationService;
import com.fpvracetracker.service.OnlineResultService;
import com.fpvracetracker.service.TransferRequestService;
import com.fpvracetracker.service.UserService;
import com.fpvracetracker.service.sync.SyncClassService;
import com.fpvracetracker.service.sync.SyncCompetitionService;
import com.fpvracetracker.service.sync.SyncPilotService;
import com.fpvracetracker.service.sync.SyncRaceBandService;
import com.fpvracetracker.service.sync.SyncRaceService;
import com.fpvracetracker.service.sync.SyncUserService;
import com.fpvracetracker.utils.Runner;

@Controller
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class Main extends AbstractVerticle {

	private static String RECAPTCHA_SECRET = "6LfUNRATAAAAAKUmbPwHyq17u9EKy6clXeh95Cem";
	private ApplicationContext context;
	private SyncPilotService syncPilotService;
	private SyncRaceService syncRaceService;
	private SyncCompetitionService syncCompetitionService;
	private SyncRaceBandService syncRaceBandService;
	private SyncClassService syncClassService;
	private SyncUserService syncUserService;
	private ObjectMapper objectMapper;
	private UserService userService;
	private TransferRequestService transferRequestService;
	private OnlineRegistrationService onlineRegistrationService;
	private OnlineResultService onlineResultService;
	private OnlineEventService onlineEventService;
	private DBTestDao dbTestDao;

	public static void main(String[] args) {
		Runner.runExample(Main.class);
	}

	@Override
	public void start() {
	
		// 1nohup java -jar fpvracetracker.jar >/root/fpvrt.log 2>&1 &

		vertx.executeBlocking(future -> {
			// needs to be done because vertx cant autowire the services
				System.setProperty("log4j.configurationFile", "META-INF/log4j.xml");
				context = new ClassPathXmlApplicationContext("/META-INF/applicationContext.xml");
				syncPilotService = (SyncPilotService) context.getBean("syncPilotService");
				syncRaceService = (SyncRaceService) context.getBean("syncRaceService");
				syncCompetitionService = (SyncCompetitionService) context.getBean("syncCompetitionService");
				syncRaceBandService = (SyncRaceBandService) context.getBean("syncRaceBandService");
				syncClassService = (SyncClassService) context.getBean("syncClassService");
				syncUserService = (SyncUserService) context.getBean("syncUserService");
				objectMapper = (ObjectMapper) context.getBean("objectMapper");
				userService = (UserService) context.getBean("userService");
				transferRequestService = (TransferRequestService) context.getBean("transferRequestService");
				onlineRegistrationService = (OnlineRegistrationService) context.getBean("onlineRegistrationService");
				onlineResultService = (OnlineResultService) context.getBean("onlineResultService");
				onlineEventService = (OnlineEventService) context.getBean("onlineEventService");
				dbTestDao = (DBTestDao) context.getBean("DBTestDao");

				Router router = Router.router(vertx);
				// router.route().handler(CookieHandler.create());
				// SessionHandler sessionHandler =
				// SessionHandler.create(LocalSessionStore.create(vertx));
				// sessionHandler.setNagHttps(false);
				// router.route().handler(sessionHandler);
				router.route().handler(BodyHandler.create());

				router.post("/sync/:type/:userUUID").handler(this::sync);
				// TODO: remove after update
				router.post("/createAccountTransfer/:userUUID").handler(this::accountTransfer);
				router.post("/transferAccount/:userUUID/:confirmationCode").handler(this::syncRequestConfirmation);
				// -----------------
				router.get("/status").handler(this::status);
				router.route("/web/*").handler(StaticHandler.create("web"));

				router.get("/createAccountTransfer/:userUUID").handler(this::accountTransfer);
				router.get("/transferAccount/:userUUID/:confirmationCode").handler(this::syncRequestConfirmation);

				router.get("/onlineRegister/classes/:onlineRegistrationKey").handler(this::getClassesOfEvent);
				router.post("/onlineRegister/registerPilot/:onlineRegistrationKey/:captcha").handler(this::registerPilot);
				router.get("/onlineRegister/removeRegistration/:onlineRegistrationUUID/:classUUID").handler(this::removeRegistration);
				router.get("/onlineRegister/registrations/:competitionUUID").handler(this::getOnlineRegistrationPilots);
				router.get("/onlineResult/:onlineResultKey").handler(this::getOnlineResult);
				router.get("/onlineEvent/:onlineEventKey").handler(this::getOnlineEvents);

				vertx.createHttpServer().requestHandler(router::accept).listen(8080);

				future.complete();
			}, res -> {
				if (res.succeeded()) {
					System.out.println("## LOADED & READY");
				} else {
					res.cause().printStackTrace();
					System.exit(0);
				}
			});
	}

	private void status(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		// TODO: select 1 from database and return 404 if db not connectable
		vertx.executeBlocking(future -> {
			int result = dbTestDao.isDbAvailable();
			future.complete(result);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				try {
					if ((int) res.result() == 1) {
						sendStatusSuccessResponse(response, "success");
					} else {
						sendError(404, response);
					}
				} catch (Exception ex) {
					sendError(404, response);
				}
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void getClassesOfEvent(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();

		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("getClassesOfEvent request incoming..");

			String onlineRegistrationKey = routingContext.request().getParam("onlineRegistrationKey");
			List<Classs> classes = onlineRegistrationService.getClassesOfEvent(onlineRegistrationKey);

			future.complete(classes);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendResponse(response, res.result());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void registerPilot(RoutingContext routingContext) {

		String captcha = routingContext.request().getParam("captcha");
		Buffer buffer = new BufferFactoryImpl().buffer();
		buffer.appendString("hello google");
		HttpClientOptions options = new HttpClientOptions();
		options.setDefaultHost("www.google.com");
		options.setDefaultPort(443);
		options.setSsl(true);
		HttpClient httpClient = vertx.createHttpClient(options);
		httpClient.post("/recaptcha/api/siteverify?secret=" + Main.RECAPTCHA_SECRET + "&response=" + captcha, new Handler<HttpClientResponse>() {

			@Override
			public void handle(HttpClientResponse httpClientResponse) {
				System.out.println("Response received " + httpClientResponse.statusCode());
				System.out.println("Response received " + httpClientResponse.statusMessage());
				httpClientResponse.bodyHandler(new HandlerImplementation(routingContext));
			}
		}).putHeader("Content-Length", "" + buffer.length()).write(buffer).end();

	}

	private void removeRegistration(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("removeRegistration request incoming..");
			String onlineRegistrationUUID = routingContext.request().getParam("onlineRegistrationUUID");
			String classUUID = routingContext.request().getParam("classUUID");

			if (onlineRegistrationService.removeClass(onlineRegistrationUUID, classUUID)) {
				future.complete();
			} else {
				future.fail(new Exception("error in online registration"));
			}
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendEmptySuccessResponse(response);
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void getOnlineResult(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();

		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("getOnlineResult request incoming..");

			String onlineResultKey = routingContext.request().getParam("onlineResultKey");
			OnlineResultResponse onlineResult = onlineResultService.getOnlineResultByOnlineResult(onlineResultKey);

			future.complete(onlineResult);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendResponse(response, res.result());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void getOnlineEvents(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();

		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("getOnlineEvent request incoming..");

			String onlineEventKey = routingContext.request().getParam("onlineEventKey");
			OnlineEventResponse onlineEventResponse = new OnlineEventResponse(onlineEventService.getOnlineEventsByKey(onlineEventKey));

			future.complete(onlineEventResponse);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendResponse(response, res.result());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void getOnlineRegistrationPilots(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();

		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("getOnlineRegistrationPilots request incoming..");

			String competitionUUID = routingContext.request().getParam("competitionUUID");
			List<OnlineRegistration> pilots = onlineRegistrationService.getPilotsOfEvent(competitionUUID);

			future.complete(pilots);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendResponse(response, res.result());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void sync(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();

		// TODO: continue
		// Session session = routingContext.session();

		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("sync request incoming..");
			String json = routingContext.getBodyAsString();
			String userUUID = routingContext.request().getParam("userUUID");
			String type = routingContext.request().getParam("type");
			if (userUUID == null || type == null) {
				future.fail(new Exception("user or type null"));
			}
			if (json == null) {
				future.fail(new Exception("json null"));
			}

			System.out.println("type: " + type);
			System.out.println("user:" + userUUID);
			System.out.println("processing: " + json);

			switch (type) {
			case SyncTypes.PILOT:
				PilotSyncRequest request = null;
				try {
					request = objectMapper.readValue(json, PilotSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				preprocessRequest(request, future);
				if (future.succeeded()) {
					return;
				}
				syncPilotService.process(request.getData(), request.user);
				break;
			case SyncTypes.COMPETITION:
				CompetitionSyncRequest competitionSyncRequest = null;
				try {
					competitionSyncRequest = objectMapper.readValue(json, CompetitionSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				preprocessRequest(competitionSyncRequest, future);
				if (future.succeeded()) {
					return;
				}
				syncCompetitionService.process(competitionSyncRequest.getData(), competitionSyncRequest.user);
				break;
			case SyncTypes.RACE:
				RaceSyncRequest raceSyncRequest = null;
				try {
					raceSyncRequest = objectMapper.readValue(json, RaceSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				preprocessRequest(raceSyncRequest, future);
				if (future.succeeded()) {
					return;
				}
				syncRaceService.process(raceSyncRequest.getData(), raceSyncRequest.user);
				break;
			case SyncTypes.RACE_BAND:
				RaceBandSyncRequest raceBandSyncRequest = null;
				try {
					raceBandSyncRequest = objectMapper.readValue(json, RaceBandSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				preprocessRequest(raceBandSyncRequest, future);
				if (future.succeeded()) {
					return;
				}
				syncRaceBandService.process(raceBandSyncRequest.getData(), raceBandSyncRequest.user);
				break;
			case SyncTypes.CLASSS:
				ClassSyncRequest classSyncRequest = null;
				try {
					classSyncRequest = objectMapper.readValue(json, ClassSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				preprocessRequest(classSyncRequest, future);
				if (future.succeeded()) {
					return;
				}
				syncClassService.process(classSyncRequest.getData(), classSyncRequest.user);
				break;
			case SyncTypes.USER:
				BaseSyncRequest userSyncRequest = null;
				try {
					userSyncRequest = objectMapper.readValue(json, BaseSyncRequest.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				checkUser(userSyncRequest.user, future);
				if (future.succeeded()) {
					return;
				}
				syncUserService.process(userSyncRequest.user);
				break;
			}
			future.complete(StatusResponseTypes.SUCCESS);
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				sendStatusSuccessResponse(response, res.result().toString());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void accountTransfer(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("sync-request request incoming..");
			String userUUID = routingContext.request().getParam("userUUID");
			if (userUUID == null) {
				future.fail(new Exception("user null"));
			}
			System.out.println("user:" + userUUID);

			StatusResponse statusResponse = transferRequestService.generateSyncRequest(userUUID);
			future.complete(statusResponse.getStatus());
		}, res -> {
			response.putHeader("content-type", "application/json");
			if (res.succeeded()) {
				System.out.println("success syncRequest: " + res.result().toString());
				sendStatusSuccessResponse(response, res.result().toString());
			} else {
				System.out.println("result: error");
				res.cause().printStackTrace();
				sendError(502, response);
			}
			System.out.println("######");
		});
	}

	private void syncRequestConfirmation(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		vertx.executeBlocking(future -> {
			System.out.println("\n######");
			System.out.println("sync-request confirmation request incoming..");
			// String userUUID = routingContext.request().getParam("userUUID");
				String verificationCode = routingContext.request().getParam("confirmationCode");
				if (verificationCode == null) {
					future.fail(new Exception("confirmationCode null"));
				}
				System.out.println("confirmationCode:" + verificationCode);

				TransferResponse remoteSyncResponse = transferRequestService.generateTransferResponse(verificationCode);
				future.complete(remoteSyncResponse);
			}, res -> {
				response.putHeader("content-type", "application/json");
				if (res.succeeded()) {
					sendResponse(response, res.result());
				} else {
					System.out.println("result: error");
					res.cause().printStackTrace();
					sendError(502, response);
				}
				System.out.println("######");
			});
	}

	@Transactional
	public void preprocessRequest(BaseSyncRequest request, Future<Object> future) {
		if (request == null || request.getData() == null) {
			future.fail(new Exception("invalid sync request"));
		}
		checkUser(request.user, future);
	}

	@Transactional
	public void checkUser(User user, Future<Object> future) {
		if (user == null) {
			future.fail(new Exception("user null"));
		}
		if (!userService.isUserAllowed(user)) {
			future.complete(StatusResponseTypes.USER_NOT_ALLOWED);
		}
	}

	private void sendError(int statusCode, HttpServerResponse response) {
		response.putHeader("Access-Control-Allow-Origin", "*");
		response.setStatusCode(statusCode).end();
	}

	public void sendResponse(HttpServerResponse response, Object responseObject) {
		response.putHeader("content-type", "application/json");
		response.putHeader("Access-Control-Allow-Origin", "*");
		try {
			response.end(objectMapper.writeValueAsString(responseObject));
		} catch (IOException e) {
			e.printStackTrace();
			sendError(502, response);
		}
	}

	public void sendStatusSuccessResponse(HttpServerResponse response, String status) {
		response.putHeader("content-type", "application/json");
		response.putHeader("Access-Control-Allow-Origin", "*");
		// response.end(objectMapper.writeValueAsString(responseObject));
		// .encodePrettily());
		response.end(new JsonObject().put("status", status).encodePrettily());
	}

	public void sendEmptySuccessResponse(HttpServerResponse response) {
		response.putHeader("content-type", "application/json");
		response.putHeader("Access-Control-Allow-Origin", "*");
		response.end(new JsonObject().put("status", "success").encodePrettily());
	}

	private final class HandlerImplementation implements Handler {

		RoutingContext ctx;

		public HandlerImplementation(RoutingContext routingContext) {
			super();
			ctx = routingContext;
		}

		@Override
		public void handle(Object event) {
			Buffer body = (Buffer) event;
			String result = body.getString(0, body.length());
			if (new JsonObject(result).getBoolean("success")) {
				proceedWithRegistration();
			} else {
				sendError(403, ctx.response());
			}
		}

		public void proceedWithRegistration() {
			HttpServerResponse response = ctx.response();
			vertx.executeBlocking(future ->

			{
				System.out.println("\n######");
				System.out.println("registerPilot request incoming..");
				String json = ctx.getBodyAsString();
				String onlineRegistrationKey = ctx.request().getParam("onlineRegistrationKey");

				OnlineRegistration registration = null;
				try {
					registration = objectMapper.readValue(json, OnlineRegistration.class);
				} catch (Exception e) {
					e.printStackTrace();
				}
				if (onlineRegistrationService.register(registration, onlineRegistrationKey)) {
					future.complete();
				} else {
					future.fail(new Exception("error in online registration"));
				}
			}, res -> {
				response.putHeader("content-type", "application/json");
				if (res.succeeded()) {
					sendEmptySuccessResponse(response);
				} else {
					System.out.println("result: error");
					res.cause().printStackTrace();
					sendError(502, response);
				}
				System.out.println("######");
			});
		}
	}
}