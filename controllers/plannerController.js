const Planner = require('../models/plannerModel');
const multer = require('multer');
const path = require('path');


const loadPlanner = async (req, res) => {
    try {
      const planner = await Planner.find();
      res.render('em/planner/get_planner', { user: req.session.user, planner });
    } catch (error) {
      console.error('Error loading planner:', error);
      res.status(500).send('Error loading planner');
    }
  };

  const loadCreatePlanner = async (req, res) => {
    try {
        const planner = await Planner.find();
      res.render('em/planner/create_planner', {
        user: req.session.user,
        planner: Planner
      });
    } catch (error) {
      console.error('Kesalahan:', error);
      res.status(500).send('Error loading page: ' + error.message);
    }
  };

  const createPlanner = async (req, res) => {
    try {
      const { tgl_planner, tema } = req.body;
      const newPlanner = new Planner({ tgl_planner, tema});
      await newPlanner.save();
      res.redirect('/em/planner/get_planner');
    } catch (error) {
      console.error('Error creating planner:', error);
      res.status(500).send('Error creating planner');
    }
  };

  const loadUpdatePlanner = async (req, res) =>{
    const id = req.params.id;
    try{
        const planner = await Planner.findById({ _id: id });
        res.render('em/planner/update_planner', {user: req.session.user, planner:planner });
    }
  
    catch (error){
        console.log(error.message);
    }
  }

  const updatePlanner = async (req, res) => {
    const id = req.params.id;
      const { tgl_planner, tema } = req.body;
      Planner.findByIdAndUpdate(id, { tgl_planner, tema })
        .then(() => {
          res.redirect('/em/planner/get_planner');
        })
        .catch(err => console.log(err));
  }

  const deletePlanner = async (req, res) => {
    const id = req.params.id;
    try {
      await Planner.findByIdAndDelete(id);
      res.redirect('/em/planner/get_planner');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  
  module.exports = {
    loadPlanner,
    loadCreatePlanner,
    createPlanner,
    loadUpdatePlanner,
    updatePlanner,
    deletePlanner
  };