// miniprogram/pages/ediltUserinfo/head/head.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      imgUrl : app.userInfo.userPhoto
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  upPhoto() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        that.setData({
          imgUrl : tempFilePaths
        })
        wx.showLoading({
          title: '头像更新中',
        })
        db.collection('users').doc(app.userInfo._id).update({
          data : {
            userPhoto : that.data.imgUrl
          }
        }).then((res)=>{
          app.userInfo.userPhoto = that.data.imgUrl
          wx.hideLoading();
          wx.showToast({
            title: '更新成功'
          })
        })
      }
    })
  },
  nochange(ev){
    let img = ev.detail.userInfo.avatarUrl;
    this.setData({
      imgUrl : img
    })
    wx.showLoading({
      title: '头像更新中',
    })
    db.collection('users').doc(app.userInfo._id).update({
      data : {
        userPhoto : this.data.imgUrl
      }
    }).then((res)=>{
      wx.hideLoading();
      wx.showToast({
        title: '更新头像成功',
      })
    })
    app.userInfo.userPhoto = this.data.imgUrl
  }
})