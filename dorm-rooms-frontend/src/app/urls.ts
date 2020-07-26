export class Urls {
  private static API_PREFIX = '/api';

  private static LABEL_ASSOCIATION_CONTROLLER   = Urls.API_PREFIX + '/labelAssociation';
  public static LABEL_ASSOCIATION_DISASSOCIATE  = Urls.LABEL_ASSOCIATION_CONTROLLER + '/disassociate';
  public static LABEL_ASSOCIATION_ASSOCIATE     = Urls.LABEL_ASSOCIATION_CONTROLLER + '/associate';

  private static LABEL_CONTROLLER = Urls.API_PREFIX + '/label';
  public static LABEL_ADD         = Urls.LABEL_CONTROLLER + '/add';
  public static LABEL_DELETE      = Urls.LABEL_CONTROLLER + '/delete';
  public static LABEL_MODIFY      = Urls.LABEL_CONTROLLER + '/modify';
  public static LABEL_GET_ALL     = Urls.LABEL_CONTROLLER + '/getAll';

  private static PERSON_CONTROLLER    = Urls.API_PREFIX + '/people';
  public static PERSON_ADD            = Urls.PERSON_CONTROLLER + '/add';
  public static PERSON_DELETE         = Urls.PERSON_CONTROLLER + '/delete';
  public static PERSON_MODIFY         = Urls.PERSON_CONTROLLER + '/modify';
  public static PERSON_GET_ALL        = Urls.PERSON_CONTROLLER + '/getAll';
  public static PERSON_GET_ALL_ADMIN  = Urls.PERSON_GET_ALL + '/admin';
  public static PERSON_GET_CURRENT    = Urls.PERSON_CONTROLLER + '/getCurrentPerson';

  private static RESERVATION_CONTROLLER       = Urls.API_PREFIX + '/reservation';
  public static RESERVATION_APPLY_FOR_ROOM    = Urls.RESERVATION_CONTROLLER + '/applyForRoom';
  public static RESERVATION_LEAVE_ROOM        = Urls.RESERVATION_CONTROLLER + '/leaveRoom';
  public static RESERVATION_CHANGE_ROOM       = Urls.RESERVATION_CONTROLLER + '/changeRoom';
  public static RESERVATION_ASSIGN_TO_ROOM    = Urls.RESERVATION_CONTROLLER + '/assignToRoom';
  public static RESERVATION_CLEAR_ROOM        = Urls.RESERVATION_CONTROLLER + '/clearRoom';

  private static ROOM_CONTROLLER        = Urls.API_PREFIX + '/room';
  public static ROOM_SET_LOCK_STATE     = Urls.ROOM_CONTROLLER + '/setLockState';
  public static ROOM_SET_ALLOWED_SEX    = Urls.ROOM_CONTROLLER + '/setAllowedSex';
  public static ROOM_GET_ALL            = Urls.ROOM_CONTROLLER + '/getAll';
}
