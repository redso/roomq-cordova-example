import Foundation
import roomq

@objc(RoomQPlugin) class RoomQPlugin: CDVPlugin {
  var roomq: RoomQ!

  @objc(initRoomQ:)
  func initRoomQ(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#initRoomQ()")
    if (roomq != nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_OK, messageAs: "The plugin succeeded"))
      return
    }
    
    let cliendID = command.arguments[0] as! String

    if (cliendID == "") {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must provide valid client ID"))
    }

    self.roomq = RoomQ(clientID: cliendID)
    self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_OK, messageAs: "The plugin succeeded"))
  }

  @objc(enqueue:)
  func enqueue(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#enqueue()")

    if (roomq == nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must call initRoomQ before this function."))
      return
    }
    
    self.roomq.enqueue { [weak self] result in
    switch result {
      case let .wait(vc, token):
        self?.showWaitingRoom(vc)
      case let .enter(source, token):
        switch source {
          case .directly, .error:
            NSLog("enter normal flow")
          default:
            NSLog("enter normal flow")
        }
      case let .error(error):
        NSLog(error.localizedDescription)
    }
    self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_OK, messageAs: "The plugin succeeded"))
    }
  }
    
  @objc(setClientToken:)
  func setClientToken(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#setClientToken()")
    if (roomq == nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must call initRoomQ before this function."))
      return
    }
    
    let token = command.arguments[0] as! String
    
    self.roomq.set(token: token)
    self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_OK, messageAs: "Client token is set"))
  }
    
  @objc(getExpiryTime:)
  func getExpiryTime(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#getExpiryTime()")
    if (roomq == nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must call initRoomQ before this function."))
      return
    }
    
    self.roomq.getExpiryTime { [weak self] result in
      switch result {
        case .success(let deadline):
          NSLog("case 1: if the session is still valid, it will return the deadline")
        case .expired:
          NSLog("case 2: the session is already expired")
        case .noToken:
          NSLog("case 3: no token obtained before")
        case .error:
          NSLog("case 4: Error occur in SDK")
      }
    }
  }
    
  @objc(extendSession:)
  func extendSession(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#extendSession()")
    if (roomq == nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must call initRoomQ before this function."))
      return
    }
    
    let minutes = command.arguments[0] as Int
    
    self.roomq.extendSession(minutes: minutes) { [weak self] result in
      switch result {
        case .extended:
          NSLog("case 1: the session is extended successfully")
        case .expired:
          NSLog("case 2: the session is already expired before extension, to proceed to waiting room, please call enqueue again")
        case .invalidExtension:
          NSLog("case 3: the session is not extended because the specified extension duration is invalid")
        case .serverError:
          NSLog("case 4: Error occur in SDK")
      }
    }
  }
    
  @objc(deleteSession:)
  func deleteSession(command: CDVInvokedUrlCommand) {
    NSLog("RoomQPlugin#deleteSession()")
    if (roomq == nil) {
      self.emit(command.callbackId, result: CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "You must call initRoomQ before this function."))
      return
    }
    
    self.roomq.deleteSession(callback: { [weak self] result in
      switch result {
        case .success:
          NSLog("case 1: the session is deleted successfully")
        case .serverError:
          NSLog("case 2: Error occur in SDK")
      }
    })
  }

  func showWaitingRoom(_ vc: UIViewController) {
    viewController.present(vc, animated: true, completion: nil)
  }

  fileprivate func emit(_ callbackId: String, result: CDVPluginResult) {
    self.commandDelegate!.send(result, callbackId: callbackId)
  }
}