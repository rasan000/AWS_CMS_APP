"use strict";
//モデルの定義
class UserModel {
  constructor() {}
  setId(id) {
    try {
      new Validater().validateRequired(id);
      this.id = new Converter(id).getValue();
    } catch (error) {
      throw error;
    }
  }
  setName(name) {
    try {
      new Validater().validateRequired(name);
      this.name = new Converter(name).getValue();
    } catch (error) {
      throw error;
    }
  }
  setCode(code) {
    try {
      new Validater().validateRequired(code);
      this.code = new Converter(code).getValue();
    } catch (error) {
      throw error;
    }
  }
  setMail(mail) {
    try {
      new Validater().validateMail(mail);
      this.mail = new Converter(mail).getValue();
    } catch (error) {
      throw error;
    }
  }
  setPassword(pass) {
    try {
      new Validater().validatePassword(pass);
      this.password = new Converter(pass).getValue();
    } catch (error) {
      throw error;
    }
  }
}

class DataModel {
  constructor() {}
  setTimeStamp(time_stamp) {
    try {
      this.time_stamp = Number(time_stamp);
    } catch (error) {
      throw error;
    }
  }
  setTarget(target) {
    try {
      new Validater().validateRequired(target);
      this.target = new Converter(target).getValue();
    } catch (error) {
      throw error;
    }
  }
  setTargetName(target_name) {
    try {
      new Validater().validateRequired(target_name);
      this.target_name = new Converter(target_name).getValue();
    } catch (error) {
      throw error;
    }
  }
  setGender(gender) {
    try {
      new Validater().validateRequired(gender);
      this.gender = new Converter(gender).getValue();
    } catch (error) {
      throw error;
    }
  }
  setInfo(info) {
    try {
      new Validater().validateRequired(info);
      this.info = new Converter(info).getValue();
    } catch (error) {
      throw error;
    }
  }
  setTelephone(val1, val2, val3) {
    try {
      const v = new Validater();
      v.validateRequired(val1);
      v.validateRequired(val2);
      v.validateRequired(val3);
      this.telephone = new Converter(val1, val2, val3).convertTelephone();
    } catch (error) {
      throw error;
    }
  }
  setBirthday(birthday) {
    try {
      new Validater().validateRequired(birthday);
      this.birthday = new Converter(birthday).convertDate();
    } catch (error) {
      throw error;
    }
  }
  setMemo(memo) {
    try {
      new Validater().validateRequired(memo);
      this.memo = new Converter(memo).getValue();
    } catch (error) {
      throw error;
    }
  }

  getTarget() {
    return this.target;
  }
  getTargetName() {
    return this.target_name;
  }
  getGender() {
    return this.gender;
  }
  getInfo() {
    return this.info;
  }
  getTelephone() {
    return this.telephone;
  }
  getBirthday() {
    return this.birthday;
  }
  getMemo() {
    return this.memo;
  }
}
