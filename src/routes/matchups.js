import { default as express} from 'express';
const router = express.Router({mergeParams: true});
import { default as Matchup} from '../models/matchup';
import { default as middleware} from '../middleware';

router.get('/', middleware.isLoggedIn, (req, res) => {
  Matchup.find({'username': req.user.username}, (err, matchups) => {
    res.render('matchups/show',{matchups});
  })
})

export default router;