var express = require('express');
var router = express.Router();
const paginate=require('express-paginate')
//const cors=require('cors')

//router.use(cors({origin:'http://localhost:3000',methods:'GET,HEAD,PUT,PATCH,POST,DELETE',}))




medicine=require('../models/medicine.js')

/* GET users listing. */



//
router.get('/dashboard', async function(req, res){
    table = await medicine.find({})
    res.json(table)
});




router.get('/dashboard/addmedicine', function(req, res) {
  res.json({addMedicineRoute:'Success'})
});



router.post('/dashboard/addmedicine/confirm', async function(req, res) {

  if(!req.body.name.trim()||!req.body.category.trim()||!req.body.instock.trim()||!req.body.price.trim())
  {
    res.json({error:"fields  can't be empty"})
  }
  else
  {
  msg=new medicine({name:req.body.name,category:req.body.category,instock:req.body.instock,price:req.body.price})
  await msg.save()
  res.json({addMedicine:'Success'})
  }
});




router.get('/dashboard/search', async function(req, res) {
  try
  {
    const search = req.query.search;
    const result = new RegExp("^" + search, "i");
    const table = await medicine.find({
        $or: [
            { name: { $regex: result } },
            { category: { $regex: result } }
        ]
    });
    res.json(table);
  }
  catch(err)
  {
    res.json({error:err})
  }
});






router.get('/dashboard/about', function(req, res) {
  res.json({aboutRoute:'Success'})
});

router.delete('/dashboard/delete/:id', async function(req, res) {
  try {
    await medicine.deleteOne({ _id: req.params.id });
    res.json({ deletion: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the medicine.' });
  }
});






router.get('/dashboard/contact', function(req, res) {
  res.json({contactRoute:'Success'})
});

router.get('/dashboard/edit/:id', async function(req, res) {
  medicine.findById(req.params.id)
        .then((data) => {
            res.json({data});
        })
        .catch((error) => {
            // Handle any other errors that might occur during the database query
            console.error('Error:', error);
            res.status(500).json('Internal Server Error');
        });

});


router.post('/dashboard/editmedicine/:id', (req, res) => {
  const updateFields = {
    name: req.body.name,
    category: req.body.category,
    instock:req.body.instock,
    price:req.body.price
  };

  const query = { _id: req.params.id };

  medicine.updateOne(query, updateFields)
    .then(() => {
      res.json({update:'Success'})
    })
    .catch((err) => {
      res.status(500).json({error:"Update error"});
    });
});





module.exports = router;
