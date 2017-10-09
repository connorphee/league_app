import express from 'express';
const router = express.Router({mergeParams: true});
import Matchup from '../models/matchup';
import middleware from '../middleware';

router.get('/', middleware.isLoggedIn, (req, res) => {
  Matchup.find({'username': req.user.username}, (err, matchups) => {
    res.render('matchups/show',{matchups});
  })
});

export default router;
