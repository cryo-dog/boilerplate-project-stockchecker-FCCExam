'use strict';

const axios = require("axios");
const LikeModel = require('../schema');
const crypto = require("crypto")

module.exports = function (app) {

  async function getStockUpdate(stock) {
    try {
      let url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
      const response = await axios.get(url);
      // console.log("Response received: ", response)
      return response.data.latestPrice;
    } catch {
      console.error('Error:', error);
    // throw error;
    }
  }

  async function likeStock(stock, hashedIP) {
    try {
  
        const existingLike = await LikeModel.findOne({"ip": hashedIP, "stock": stock});
        if (!existingLike) {
          const likeData = new LikeModel({ "ip": hashedIP, "stock": stock });
          await likeData.save();
        }
      
    } catch (error) {
      console.error('Error:', error);
    // throw error;
    }
  }
  
  app.route('/api/stock-prices')
    .get(async function (req, res){
      const stocksArray = Array.isArray(req.query.stock) ? req.query.stock : [req.query.stock]
      const like = req.query.like === "true"
      const ipAddress = req.ip; // To be hashed once in production
      const hashedIP = crypto.createHash('sha256').update(ipAddress).digest('hex');
      
    
      try {

        if (like) {
          likeStock(stocksArray[0], hashedIP);
        }
        

        if (stocksArray[1]) 
          {
            let price1 = await getStockUpdate(stocksArray[0]);
            const count1 = await LikeModel.countDocuments({stock: stocksArray[0]});
            let price2 = await getStockUpdate(stocksArray[0]);
            const count2 = await LikeModel.countDocuments({stock: stocksArray[1]});            
            let count = count1 - count2 
            res.json({"stockData": 
              [{"stock": stocksArray[0],"price":price1, "rel_likes": count},
              {"stock": stocksArray[1],"price":price2, "rel_likes": -count}]       });
          } else {
            let latestPrice = await getStockUpdate(stocksArray[0]);
            const count = await LikeModel.countDocuments({stock: stocksArray[0]});
            res.json({"stockData": {"stock": stocksArray[0], "price":latestPrice, "likes": count}});
          }
        
        console.log("Stock price is: ", latestPrice)
      } catch (error) {
       // res.status(500).json({ error: 'An error occurred' });
      }
      
    });
    
};
