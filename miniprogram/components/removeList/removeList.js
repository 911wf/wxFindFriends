// components/removeList/removeList.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    messageId : String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage(){
      let that = this;
      let mesId = this.data.messageId;
      wx.showModal({
        title : '提示信息',
        content : '删除信息',
        confirmText : '删除',
        success(res){
          if(res.confirm){
            db.collection('message').where({
              userId : app.userInfo._id
            }).get().then((res)=>{
              let list = res.data[0].list;
              list = list.filter((val,i)=>{
                return val != mesId
              })
              wx.cloud.callFunction({
                name : 'update',
                data : {
                  collection : 'message',
                  where : {
                    userId : app.userInfo._id
                  },
                  data : {
                    list
                  }
                }
              }).then((res)=>{
                  that.triggerEvent('myevent',list);
              })
            })
          }else if(res.cancel){

          }
        }
      })
    },
    handelAddFriend(){
      let that = this;
      let mesId = this.data.messageId;
      wx.showModal({
        title : '提示信息',
        content : '申请好友',
        confirmText : '同意',
        success(res){
          if(res.confirm){
            
            db.collection('users').doc(app.userInfo._id).update({
              data : {
                friendList : _.unshift(that.data.messageId)
              }
            }).then((res)=>{
              db.collection('message').where({
                userId : app.userInfo._id
              }).get().then((res)=>{
                let list = res.data[0].list;
                list = list.filter((val,i)=>{
                  return val != mesId
                })
                wx.cloud.callFunction({
                  name : 'update',
                  data : {
                    collection : 'message',
                    where : {
                      userId : app.userInfo._id
                    },
                    data : {
                      list
                    }
                  }
                }).then((res)=>{
                    that.triggerEvent('myevent',list);
                })
              })
            })
            wx.cloud.callFunction({
              name : 'update',
              data : {
                collection : 'users',
                doc : that.data.messageId,
                data : `{ friendList : _.unshift('${app.userInfo._id}')}`
              }
            }).then((res)=>{

            })
          }else if(res.cancel){

          }
        }
      })
    }
  },
  removeMessage(){
    db.collection('message').where({
      userId : app.userInfo._id
    }).get().then((res)=>{
      let list = res.data[0].list;
      list = list.filter((val,i)=>{
        return val != mesId
      })
      wx.cloud.callFunction({
        name : 'update',
        data : {
          collection : 'message',
          where : {
            userId : app.userInfo._id
          },
          data : {
            list
          }
        }
      }).then((res)=>{
          this.triggerEvent('myevent',list);
      })
    })
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({
        userPhoto: true,
        nickName: true
      }).get().then((res) => {
        this.setData({
          userMessage: res.data
        })
      })
    }
  }

})