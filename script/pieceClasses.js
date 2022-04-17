class Pawn {
    /*Essa função calcula aonde essa peça pode andar de acordo com sua posição atual*/
    static whereCanWalkCalculation(position) {
        return [position + 8];
        
        /*
        let currentPositionChecking = position;

        while (currentPositionChecking + 8 <= 64) {
            currentPositionChecking += 8;
            positionsCanWalk.push(currentPositionChecking);
        }
        
        return positionsCanWalk;
        */
    }
}