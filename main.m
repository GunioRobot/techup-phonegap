//
//  main.m
//  techup-phonegap
//
//  Created by Vedran Zgela on 12/9/10.
//  Copyright Liip AG 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"techup_phonegapAppDelegate");
    [pool release];
    return retVal;
}
